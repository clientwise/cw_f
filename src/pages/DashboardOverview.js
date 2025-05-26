import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AddClientModal from '../components/clients/AddClientModal';

// Import Chart.js components
import {
    Chart as ChartJS,
    CategoryScale, // x axis
    LinearScale, // y axis
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Assume themeColors is available globally or via context/props
const themeColors = {
    brandPurple: '#5a239e', brandPurpleHover: '#703abc',
    purple100: '#ede9fe', yellow100: '#fef9c3', yellow600: '#ca8a04',
    green100: '#dcfce7', green600: '#16a34a', green500: '#22c55e',
    blue100: '#dbeafe', blue600: '#2563eb', blue500: '#3b82f6',
    red50: '#fef2f2', red100: '#fee2e2', red600: '#dc2626', red800: '#991b1b',
    gray100: '#f3f4f6', gray200: '#e5e7eb', gray400: '#9ca3af',
    gray500: '#6b7280', gray600: '#4b5563', gray700: '#374151',
    gray800: '#1f2937', white: '#ffffff',
};

// Helper function to format date strings or return 'N/A'
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        if (typeof dateString === 'object' && dateString !== null && dateString.Valid && dateString.Time) { dateString = dateString.Time; }
        else if (typeof dateString === 'object' && dateString !== null && !dateString.Valid) { return 'N/A'; }
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        if (date.getHours() !== 0 || date.getMinutes() !== 0 || date.getSeconds() !== 0) {
            return date.toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
        }
        return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) { console.warn("Date formatting error for:", dateString, e); return 'Error'; }
};

// Helper to get card icon background/text colors
const getIconBgColor = (color) => {
    switch (color) {
        case 'purple': return 'bg-purple-100 text-[--brand-purple]';
        case 'yellow': return 'bg-yellow-100 text-yellow-600';
        case 'green': return 'bg-green-100 text-green-600';
        case 'blue': return 'bg-blue-100 text-blue-600';
        default: return 'bg-gray-100 text-gray-600';
    }
}

// Helper for activity icons
const getActivityIcon = (activityType) => {
    switch (activityType?.toLowerCase()) {
        case 'client_added': return { icon: 'fas fa-user-check', color: 'text-green-500' };
        case 'policy_added': return { icon: 'fas fa-file-alt', color: 'text-blue-500' };
        case 'comm_logged': return { icon: 'fas fa-phone', color: 'text-purple-500' };
        case 'task_added': return { icon: 'fas fa-check-square', color: 'text-indigo-500' };
        case 'doc_uploaded': return { icon: 'fas fa-upload', color: 'text-cyan-500' };
        case 'client_updated': return { icon: 'fas fa-user-edit', color: 'text-orange-500' };
        default: return { icon: 'fas fa-info-circle', color: 'text-gray-500' };
    }
};

// Helper function to safely extract values from Go's sql.Null* types
const getValue = (field, defaultValue = null) => {
    if (field && field.Valid) {
        if (field.String !== undefined) return field.String;
        if (field.Float64 !== undefined) return field.Float64;
        if (field.Int64 !== undefined) return field.Int64;
        if (field.Time !== undefined) return field.Time;
        return defaultValue;
    }
    return defaultValue;
};

// Function to build the structured JSON payload for the AI model
const buildAiJsonPayload = (goalData, fullClientData, dashboardTasks) => {
    const agentContext = {
        annualIncomeGoal: getValue(goalData?.targetIncome),
        targetPeriod: getValue(goalData?.targetPeriod),
    };

    const clientDetails = (fullClientData || []).map(data => ({
        clientProfile: {
            id: data.client.id,
            name: data.client.name,
            status: data.client.status,
            email: getValue(data.client.email),
            phone: getValue(data.client.phone),
            dob: getValue(data.client.dob),
            address: getValue(data.client.address),
            income: getValue(data.client.income),
            maritalStatus: getValue(data.client.maritalStatus),
            dependents: getValue(data.client.dependents),
            jobProfile: getValue(data.client.jobProfile),
            lastContactedAt: getValue(data.client.lastContactedAt)
        },
        policies: (data.policies || []).map(p => ({
            id: p.id,
            policyNumber: p.policyNumber,
            status: p.status,
            premium: p.premium,
            sumInsured: p.sumInsured,
            startDate: getValue(p.startDate),
            endDate: getValue(p.endDate)
        })),
        communications: (data.communications || []).map(c => ({
            id: c.id,
            type: c.type,
            timestamp: c.timestamp,
            summary: c.summary
        })),
        tasks: (data.tasks || []).map(t => ({
            id: t.id,
            description: t.description,
            isCompleted: t.isCompleted,
            isUrgent: t.isUrgent,
            dueDate: getValue(t.dueDate)
        }))
    }));

    const pendingTasks = (dashboardTasks || []).map(task => ({
        id: task.id,
        description: task.description,
        isUrgent: task.isUrgent,
        dueDate: getValue(task.dueDate),
        relatedClientId: task.relatedId
    }));

    return { agentContext, clientDetails, pendingTasks };
};

// --- Dashboard Overview Screen ---
const DashboardOverview = () => {
    const [metrics, setMetrics] = useState({ policiesSoldThisMonth: 0, upcomingRenewals30d: 0, commissionThisMonth: 0, newLeadsThisWeek: 0 });
    const [tasks, setTasks] = useState([]);
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [aiPlan, setAiPlan] = useState(null);
    const [isFetchingAiAssign, setIsFetchingAiAssign] = useState(false);
    const [aiAssignError, setAiAssignError] = useState(null);
    const [salesData, setSalesData] = useState([]);
    const [isChartLoading, setIsChartLoading] = useState(true);
    const [chartError, setChartError] = useState(null);
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [isSuggestingTasks, setIsSuggestingTasks] = useState(false);
    const [suggestTasksError, setSuggestTasksError] = useState(null);
    const [suggestTasksSuccess, setSuggestTasksSuccess] = useState('');
    
    // --- NEW: State for UX updates ---
    const [activeDayIndex, setActiveDayIndex] = useState(0);
    const [taskCreationStatus, setTaskCreationStatus] = useState({});

    // Use a ref to hold the function to avoid re-creating it on every render,
    // satisfying the useCallback dependency lint rule.
    const fetchDashboardDataRef = React.useRef();

    const handleCreateTask = useCallback(async (clientId, description, dueDate) => {
        const statusKey = `${clientId}-${description}`;
        setTaskCreationStatus(prev => ({ ...prev, [statusKey]: { loading: true, error: null, success: '' } }));

        const token = localStorage.getItem('authToken');
        if (!token) {
            setTaskCreationStatus(prev => ({ ...prev, [statusKey]: { loading: false, error: 'Auth error', success: '' } }));
            return;
        }

        const formattedDueDate = new Date(dueDate).toLocaleDateString('en-CA');
        const payload = { description, dueDate: formattedDueDate, isUrgent: false };

        try {
            const response = await fetch(`http://api.goclientwise.com/api/clients/${clientId}/tasks`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to create task');
            }

            setTaskCreationStatus(prev => ({ ...prev, [statusKey]: { loading: false, error: null, success: 'Task created!' } }));
            setTimeout(() => fetchDashboardDataRef.current('tasks'), 2000);

        } catch (err) {
            setTaskCreationStatus(prev => ({ ...prev, [statusKey]: { loading: false, error: err.message, success: '' } }));
        }
    }, []);

    const fetchAiAssignRecommendation = useCallback(async (goalData, fullClientData, dashboardTasks) => {
        if (!goalData || !fullClientData) {
            setAiAssignError("Missing necessary data for AI assignment.");
            return;
        }
        setIsFetchingAiAssign(true);
        setAiAssignError(null);
        setAiPlan(null);
        setActiveDayIndex(0);

        const GOOGLE_AI_API_KEY = "AIzaSyD9fhI0nZlTwkfQ-0rm2p-s23AUJdLlSjI"; // <<< IMPORTANT: REPLACE WITH YOUR KEY
        if (GOOGLE_AI_API_KEY.includes("YOUR_GOOGLE")) {
            setAiAssignError("Google AI API Key not configured.");
            setIsFetchingAiAssign(false);
            return;
        }

        const jsonPayload = buildAiJsonPayload(goalData, fullClientData, dashboardTasks);
        
        const promptText = `
You are an expert Sales Strategist and CRM Assistant for Insurance Agents.
Your task is to analyze the provided JSON data and generate a detailed, actionable 7-day schedule.

**CRITICAL INSTRUCTION: Your entire response MUST be a single, valid JSON object. Do not include any text, explanation, or markdown formatting like \`\`\`json before or after the JSON object.**

The JSON object you return should have the following structure:
{
  "weeklyGoal": "A brief, strategic goal for the week based on the agent's income target.",
  "dailyPlan": [
    {
      "day": "Monday",
      "date": "YYYY-MM-DD",
      "theme": "A short theme for the day's activities, e.g., 'High-Priority Client Outreach'.",
      "clientInteractions": [
        {
          "clientName": "Name of the client to contact.",
          "clientId": "The integer ID of the client from the input data.",
          "objective": "The primary goal of this interaction, e.g., 'Discuss Child Education Plan'.",
          "interactionMode": "The recommended method, e.g., 'Phone Call', 'Email', 'Meeting'.",
          "talkingPoints": "A specific, ready-to-use script or key points for the agent to say.",
          "productsToFocusOn": ["An array of product names to discuss."],
          "rationale": "A brief explanation of WHY this client and WHY this recommendation is timely."
        }
      ],
      "generalTasks": ["An array of strings for non-client-specific tasks, like prospecting or admin work."]
    }
  ]
}

**Instructions:**
- **Your first priority is to schedule all tasks from the 'pendingTasks' array. Then, add new recommended client activities around them.**
- Prioritize clients with upcoming policy renewals, recent life events, or those who are high-value but haven't been contacted recently.
- Be specific with your recommendations. Suggest concrete actions, talking points, and specific products to discuss.
- Propose a realistic schedule with a manageable number of key interactions per day.
- Calculate the correct dates for the upcoming week, starting from next Monday. The current date is ${new Date().toLocaleDateString('en-CA')}.
- If the 'clientDetails' array in the input data is empty, return a JSON object with this specific structure: { "weeklyGoal": "Build initial lead pipeline.", "dailyPlan": [] }.

Here is the data to analyze:
${JSON.stringify(jsonPayload, null, 2)}
`;
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_AI_API_KEY}`;
        const requestBody = {
            contents: [{ parts: [{ "text": promptText }] }],
            generationConfig: { "responseMimeType": "application/json" },
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });
            if (!response.ok) {
                let errorMsg = `Google AI API Error: ${response.status}`;
                try { const errData = await response.json(); errorMsg = errData.error?.message || errorMsg; } catch (e) { }
                throw new Error(errorMsg);
            }
            const data = await response.json();
            const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText) {
                try {
                    const generatedJson = JSON.parse(rawText);
                    setAiPlan(generatedJson);
                } catch (parseError) {
                    throw new Error("AI returned invalid JSON.");
                }
            } else {
                throw new Error("Could not extract suggestion from API response.");
            }
        } catch (err) {
            setAiAssignError(err.message || "Failed to get AI assignment suggestion.");
        } finally {
            setIsFetchingAiAssign(false);
        }
    }, []);

    fetchDashboardDataRef.current = useCallback(async (refreshType = 'all') => {
        if (refreshType === 'all') setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('authToken');
        if (!token) { setError("Authentication error: Not logged in."); setIsLoading(false); return; }

        const headers = { 'Authorization': `Bearer ${token}` };
        const baseApiUrl = 'https://api.goclientwise.com/api';
        const fetchDataFor = async (url) => {
            const response = await fetch(url, { headers });
            if (!response.ok) {
                let errorMsg = `Error fetching ${url}: ${response.status}`;
                try { const d = await response.json(); errorMsg = d.error || errorMsg; } catch (e) { }
                throw new Error(errorMsg);
            }
            return response.json();
        };

        try {
            const results = await Promise.allSettled([
                fetchDataFor(`${baseApiUrl}/dashboard/metrics`),
                fetchDataFor(`${baseApiUrl}/dashboard/tasks?limit=20`),
                fetchDataFor(`${baseApiUrl}/dashboard/activity?limit=300`),
                fetchDataFor(`${baseApiUrl}/agents/goals`),
                fetchDataFor(`${baseApiUrl}/agents/my-clients-full-data`),
                fetchDataFor(`${baseApiUrl}/agents/sales-performance`)
            ]);

            const [metricsResult, tasksResult, activityResult, goalResult, clientListResult, salesPerfResult] = results;

            if (metricsResult.status === 'fulfilled') setMetrics(metricsResult.value || { policiesSoldThisMonth: 0, upcomingRenewals30d: 0, commissionThisMonth: 0, newLeadsThisWeek: 0 });
            if (tasksResult.status === 'fulfilled') setTasks(tasksResult.value || []);
            if (activityResult.status === 'fulfilled') setActivities(activityResult.value || []);
            if (salesPerfResult.status === 'fulfilled') {
                setSalesData(salesPerfResult.value);
                setIsChartLoading(false);
            } else {
                setChartError(salesPerfResult.reason?.message);
                setIsChartLoading(false);
            }

            const firstError = results.find(r => r.status === 'rejected');
            if (firstError) {
                setError(prev => prev || firstError.reason.message || "An error occurred.");
            }

            if (goalResult.status === 'fulfilled' && clientListResult.status === 'fulfilled') {
                fetchAiAssignRecommendation(
                    goalResult.value,
                    clientListResult.value,
                    tasksResult.status === 'fulfilled' ? tasksResult.value : []
                );
            } else {
                const goalError = goalResult.status === 'rejected' ? 'agent goals' : null;
                const clientListError = clientListResult.status === 'rejected' ? 'client data' : null;
                const aiDataError = [goalError, clientListError].filter(Boolean).join(' and ');
                setAiAssignError(`Could not generate AI assignment: Failed to load ${aiDataError}.`);
                setIsFetchingAiAssign(false);
            }

        } catch (err) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [fetchAiAssignRecommendation]);

    useEffect(() => {
        fetchDashboardDataRef.current();
    }, []);

    const handleSuggestTasks = async () => { /* ... (no changes needed) ... */ };
    const openClientModal = () => setIsClientModalOpen(true);
    const closeClientModal = () => setIsClientModalOpen(false);
    const handleClientAdded = () => {
        closeClientModal();
        fetchDashboardDataRef.current('all');
    };

    const chartData = useMemo(() => {
        const labels = salesData?.map(d => d.month) || [];
        const dataPoints = salesData?.map(d => d.count) || [];
        return {
            labels,
            datasets: [{
                label: 'Policies Sold per Month',
                data: dataPoints,
                borderColor: themeColors.brandPurple,
                backgroundColor: 'rgba(90, 35, 158, 0.1)',
                tension: 0.1,
                fill: true,
            }],
        };
    }, [salesData]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'top' },
            title: { display: false },
            tooltip: { mode: 'index', intersect: false },
        },
        scales: {
            y: { beginAtZero: true, ticks: { precision: 0 } },
        },
    };

    if (isLoading && !aiPlan && !error) {
        return <div className="text-center p-10 text-gray-500"><i className="fas fa-spinner fa-spin text-3xl text-[--brand-purple]"></i><p className="mt-2">Loading Dashboard...</p></div>;
    }
    if (error && !metrics) {
        return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4" role="alert"><strong className="font-bold">Error: </strong><span className="block sm:inline">{error}</span></div>;
    }

    const currentDayPlan = aiPlan?.dailyPlan?.[activeDayIndex];

    return (
        <div className="" style={{ '--brand-purple': themeColors.brandPurple }}>
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg text-white">
                <h2 className="text-xl font-semibold mb-2 flex items-center">
                    <i className="fas fa-brain mr-2"></i> AI Assist - Your Weekly AI Guide
                </h2>
                {isFetchingAiAssign ? (
                    <div className="flex items-center justify-center p-4">
                        <i className="fas fa-spinner fa-spin text-2xl mr-3"></i> Generating suggestions...
                    </div>
                ) : aiAssignError ? (
                    <div className="text-sm text-red-100 p-2 bg-red-800 bg-opacity-50 border border-red-300 rounded">
                        <strong className="font-bold">Error:</strong> {aiAssignError}
                    </div>
                ) : aiPlan ? (
                    <div className="text-sm space-y-4">
                        {aiPlan.weeklyGoal && (
                            <div className="border-b border-purple-400 pb-3 mb-3">
                                <h3 className="font-bold text-base mb-1">This Week's Goal</h3>
                                <p className="text-purple-100">{aiPlan.weeklyGoal}</p>
                            </div>
                        )}
                        <div className="flex space-x-1 border-b border-purple-400">
                            {(aiPlan.dailyPlan || []).map((day, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveDayIndex(index)}
                                    className={`px-3 py-2 text-sm font-medium focus:outline-none transition-colors duration-200 ${activeDayIndex === index ? 'bg-white text-purple-700 rounded-t-md' : 'text-purple-200 hover:bg-purple-500 hover:bg-opacity-50'}`}
                                >
                                    {day.day}
                                </button>
                            ))}
                        </div>
                        <div className="pt-3 min-h-[150px]">
                        {currentDayPlan ? (
                            <div className="space-y-3">
                                <h4 className="font-bold text-purple-200">{currentDayPlan.day} ({formatDate(currentDayPlan.date)}) - <span className="italic font-normal">{currentDayPlan.theme}</span></h4>
                                {(currentDayPlan.clientInteractions || []).map((rec, recIndex) => {
                                    const statusKey = `${rec.clientId}-${rec.objective}`;
                                    const status = taskCreationStatus[statusKey] || {};
                                    return (
                                    <div key={recIndex} className="p-3 bg-purple-500 bg-opacity-40 rounded-md ml-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-white"><i className="fas fa-user mr-2"></i>
                                                    {rec.clientName} (<Link to={`/dashboard/clients/${rec.clientId}`} className="underline hover:text-yellow-300">ID: {rec.clientId}</Link>)
                                                </p>
                                                <p><strong className="text-purple-200">Objective:</strong> {rec.objective}</p>
                                                <p><strong className="text-purple-200">Method:</strong> {rec.interactionMode}</p>
                                                <p className="mt-1 italic">"{rec.talkingPoints}"</p>
                                                <p className="mt-1 text-xs"><strong className="text-purple-200">Rationale:</strong> {rec.rationale}</p>
                                            </div>
                                            <div className="flex-shrink-0 ml-2">
                                                <button 
                                                  onClick={() => handleCreateTask(rec.clientId, rec.objective, currentDayPlan.date)}
                                                  disabled={status.loading || !!status.success}
                                                  className="px-2 py-1 text-xs font-semibold text-purple-700 bg-white rounded hover:bg-purple-100 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                                                >
                                                    {status.loading ? <i className="fas fa-spinner fa-spin"></i> : status.success ? <><i className="fas fa-check"></i> {status.success}</> : <><i className="fas fa-plus mr-1"></i>Create Task</>}
                                                </button>
                                                {status.error && <p className="text-xs text-red-300 mt-1">{status.error}</p>}
                                            </div>
                                        </div>
                                    </div>
                                    )})}
                                {(currentDayPlan.generalTasks || []).map((task, taskIndex) => (
                                    <div key={taskIndex} className="p-2 bg-indigo-500 bg-opacity-40 rounded-md ml-4 text-purple-100">
                                       <i className="fas fa-tasks mr-2"></i> {task}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No plan for this day.</p>
                        )}
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-purple-100 italic">AI assignment suggestions will appear here.</p>
                )}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                <div className="bg-white p-5 rounded-lg shadow border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div> <p className="text-sm font-medium text-gray-500">Policies Sold (Month)</p> <p className="text-2xl font-bold text-gray-800">{metrics?.policiesSoldThisMonth ?? 0}</p> </div>
                        <div className={`p-3 rounded-full ${getIconBgColor('purple')}`}> <i className="fas fa-file-signature fa-lg"></i> </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">vs last month</p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div> <p className="text-sm font-medium text-gray-500">Upcoming Renewals (30d)</p> <p className="text-2xl font-bold text-gray-800">{metrics?.upcomingRenewals30d ?? 0}</p> </div>
                        <div className={`p-3 rounded-full ${getIconBgColor('yellow')}`}> <i className="fas fa-calendar-check fa-lg"></i> </div>
                    </div>
                    <Link to="/dashboard/renewals" className="text-xs text-purple-600 hover:underline mt-2 block">View Renewals</Link>
                </div>
                <div className="bg-white p-5 rounded-lg shadow border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div> <p className="text-sm font-medium text-gray-500">Commission (Month)</p> <p className="text-2xl font-bold text-gray-800">₹{metrics?.commissionThisMonth?.toLocaleString('en-IN') ?? 0}</p> </div>
                        <div className={`p-3 rounded-full ${getIconBgColor('green')}`}> <i className="fas fa-rupee-sign fa-lg"></i> </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Estimated</p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div> <p className="text-sm font-medium text-gray-500">New Leads (Week)</p> <p className="text-2xl font-bold text-gray-800">{metrics?.newLeadsThisWeek ?? 0}</p> </div>
                        <div className={`p-3 rounded-full ${getIconBgColor('blue')}`}> <i className="fas fa-user-plus fa-lg"></i> </div>
                    </div>
                    <Link to="/dashboard/clients" className="text-xs text-purple-600 hover:underline mt-2 block">Manage Leads</Link>
                </div>

                <div className="bg-white p-5 rounded-lg shadow border border-gray-100 md:col-span-2 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Tasks & Reminders</h3>
                    {tasks.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No upcoming tasks.</p>
                    ) : (
                        <ul className="space-y-3">
                            {tasks.map((task) => (
                                <li key={task.id} className={`flex items-center justify-between text-sm p-2 rounded ${task.isUrgent ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                                    <span className={task.isUrgent ? 'text-red-700' : ''}>{task.description}</span>
                                    <span className={`text-xs font-medium ${task.isUrgent ? 'text-red-600' : 'text-gray-500'}`}>{formatDate(task.dueDate?.String)}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                    <Link to="/dashboard/tasks" className="text-xs text-purple-600 hover:underline mt-4 block text-right">View All Tasks</Link>
                </div>

                <div className="bg-white p-5 rounded-lg shadow border border-gray-100 md:col-span-2 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                    {activities.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No recent activity.</p>
                    ) : (
                        <ul className="space-y-3 text-sm">
                            {activities.map((activity) => {
                                const iconInfo = getActivityIcon(activity.activityType);
                                return (
                                    <li key={activity.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
                                        <i className={`${iconInfo.icon} ${iconInfo.color} w-4 text-center`}></i>
                                        <span>{activity.description}</span>
                                        <span className="text-xs text-gray-400 ml-auto flex-shrink-0">{formatDate(activity.timestamp)}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                    <Link to="/dashboard/activity" className="text-xs text-purple-600 hover:underline mt-4 block text-right">View Full Log</Link>
                </div>

                <div className="bg-white p-5 rounded-lg shadow border border-gray-100 lg:col-span-1 xl:col-span-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                        <button onClick={openClientModal} className="w-full text-left text-sm p-2 rounded bg-purple-50 text-purple-700 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-300"><i className="fas fa-user-plus w-4 mr-2"></i>Add New Client</button>
                        <Link to="/dashboard/clients" className="block w-full text-left text-sm p-2 rounded bg-purple-50 text-purple-700 hover:bg-purple-100"><i className="fas fa-file-medical w-4 mr-2"></i>Add New Policy</Link>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-lg shadow border border-gray-100 lg:col-span-3 xl:col-span-3">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Performance (Policies/Month)</h3>
                    <div className="relative h-64 md:h-72">
                        {isChartLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-500"><i className="fas fa-spinner fa-spin mr-2"></i>Loading Chart...</div>
                        ) : chartError ? (
                            <div className="absolute inset-0 flex items-center justify-center text-red-500 text-sm">{chartError}</div>
                        ) : salesData && salesData.length > 0 ? (
                            <Line options={chartOptions} data={chartData} />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-500 italic">No sales data available for the last 12 months.</div>
                        )}
                    </div>
                </div>
            </div>

            <AddClientModal
                isOpen={isClientModalOpen}
                onClose={closeClientModal}
                onClientAdded={handleClientAdded}
            />
        </div>
    );
};

export default DashboardOverview;