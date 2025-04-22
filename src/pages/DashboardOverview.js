import React, { useState, useEffect, useCallback ,useMemo} from 'react';
// Assuming Button is imported if needed for Quick Actions later
import Button from '../components/common/Button';
import { Link } from 'react-router-dom'; // Import Link
import AddClientModal from '../components/clients/AddClientModal'; // Import Add Client Modal


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
         // Handle potential null time from Go's sql.NullTime
         if (typeof dateString === 'object' && dateString !== null && dateString.Valid && dateString.Time) { dateString = dateString.Time; }
         else if (typeof dateString === 'object' && dateString !== null && !dateString.Valid) { return 'N/A'; }
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        // Format date and time for activity log/timestamp fields
        if (date.getHours() !== 0 || date.getMinutes() !== 0 || date.getSeconds() !== 0) {
            return date.toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short'}); // Use locale string for combined date/time
        }
        // Format date only otherwise (e.g., DOB, expiry)
        return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) { console.warn("Date formatting error for:", dateString, e); return 'Error'; }
 };

// Helper to get card icon background/text colors
const getIconBgColor = (color) => {
    switch(color) {
        case 'purple': return 'bg-purple-100 text-[--brand-purple]';
        case 'yellow': return 'bg-yellow-100 text-yellow-600';
        case 'green': return 'bg-green-100 text-green-600';
        case 'blue': return 'bg-blue-100 text-blue-600';
        default: return 'bg-gray-100 text-gray-600';
    }
}

// Helper for activity icons (maps backend activity_type to Font Awesome)
const getActivityIcon = (activityType) => {
    switch(activityType?.toLowerCase()) {
        case 'client_added': return { icon: 'fas fa-user-check', color: 'text-green-500'};
        case 'policy_added': return { icon: 'fas fa-file-alt', color: 'text-blue-500'};
        case 'comm_logged': return { icon: 'fas fa-phone', color: 'text-purple-500'};
        case 'task_added': return { icon: 'fas fa-check-square', color: 'text-indigo-500'};
        case 'doc_uploaded': return { icon: 'fas fa-upload', color: 'text-cyan-500'};
        case 'client_updated': return { icon: 'fas fa-user-edit', color: 'text-orange-500'};
        // Add more mappings as needed
        default: return { icon: 'fas fa-info-circle', color: 'text-gray-500'};
    }
};


// --- Dashboard Overview Screen ---
const DashboardOverview = () => {
    // State for different sections
    const [metrics, setMetrics] = useState({ policiesSoldThisMonth: 0, upcomingRenewals30d: 0, commissionThisMonth: 0, newLeadsThisWeek: 0 });
    const [tasks, setTasks] = useState([]);
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [aiAssignText, setAiAssignText] = useState('');
    const [isFetchingAiAssign, setIsFetchingAiAssign] = useState(false);
    const [aiAssignError, setAiAssignError] = useState(null);
   // --- NEW: State for Sales Chart ---
   const [salesData, setSalesData] = useState([]);
   const [isChartLoading, setIsChartLoading] = useState(true);
   const [chartError, setChartError] = useState(null);
   // ---------------------------------

   // --- NEW: State for Add Client Modal ---
   const [isClientModalOpen, setIsClientModalOpen] = useState(false);
   // -----
    const [isSuggestingTasks, setIsSuggestingTasks] = useState(false);
    const [suggestTasksError, setSuggestTasksError] = useState(null);
    const [suggestTasksSuccess, setSuggestTasksSuccess] = useState('');
    // ---------------------------------------------
    // Fetch all dashboard data on component mount

    const fetchAiAssignRecommendation = useCallback(async (goalData, clientListData) => {
      if (!goalData || !clientListData) {
          console.log("Skipping AI Assign fetch: Missing goal or client list data.");
          setAiAssignError("Missing necessary data for AI assignment.");
          return;
      }

      setIsFetchingAiAssign(true);
      setAiAssignError(null);
      setAiAssignText('');

      // --- SECURITY WARNING ---
      // NEVER embed your real API key directly in frontend code in production!
      const GOOGLE_AI_API_KEY = "AIzaSyAoIOupDd4VBbcJMob0tTlaiGOTsP3AqXg"; // <<< REPLACE FOR TESTING ONLY
      if (GOOGLE_AI_API_KEY === "AIzaSyAoIOuDd4VBbcJMob0tTlaiGOTsP3AqXg") {
           setAiAssignError("Google AI API Key not configured in frontend code.");
           setIsFetchingAiAssign(false);
           return;
      }
      // ------------------------

      // --- Data Summarization for Prompt ---
      console.log(clientListData,"clientListData")
      const goalIncome = goalData?.targetIncome?.Valid ? `₹${goalData.targetIncome.Float64.toLocaleString('en-IN')}` : 'not set';
      const goalPeriod = goalData?.targetPeriod?.String || 'not set';
      const totalClients = clientListData.length;
      const leadCount = clientListData.filter(c => c.client.status?.toLowerCase() === 'lead').length;
      const activeCount = clientListData.filter(c => c.client.status?.toLowerCase() === 'active').length;
      // Basic summary - more detail could be added (avg income, top category etc.)
      const clientSummary = `${totalClients} total clients (${leadCount} leads, ${activeCount} active).`;
      // --- End Summarization ---


      // Construct the prompt
      const promptText = `I am a very entry level insurance agent. My current goal is to achieve an income of ${goalIncome} for the period ${goalPeriod}.  My client activity log : ${clientListData}. My Corrent income ${metrics.commissionThisMonth.toLocaleString('en-IN')}. Based on my activity log, suggest what should I do this week and why should I do that this week. In short crisp 50 words.  Also, suggest next plan of action for my existing 5 clients. You can be brutal`;

      console.log("Sending AI Assign prompt to Gemini:", promptText);

      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_AI_API_KEY}`;
      const requestBody = {
          contents: [{ parts: [{"text": promptText}] }],
          // Optional: Add safetySettings and generationConfig if needed
          // generationConfig: { temperature: 0.7, topP: 1.0, maxOutputTokens: 250 }
      };

      try {
          const response = await fetch(API_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(requestBody)
          });

          if (!response.ok) {
              let errorMsg = `Google AI API Error: ${response.status}`;
               try { const errData = await response.json(); errorMsg = errData.error?.message || errorMsg; } catch (e) {}
              throw new Error(errorMsg);
          }

          const data = await response.json();
          console.log("AI Assign Gemini Response:", data);

          // Extract text
          const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

          if (generatedText) {
              setAiAssignText(generatedText);
          } else {
              throw new Error("Could not extract suggestion text from API response.");
          }

      } catch (err) {
          console.error("AI Assign Fetch Error:", err);
          setAiAssignError(err.message || "Failed to get AI assignment suggestion.");
      } finally {
          setIsFetchingAiAssign(false);
      }

  }, []);
  const fetchDashboardData = useCallback(async (refreshType = 'all') => {
    setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('authToken');
        if (refreshType === 'all') setIsLoading(true);
        // Clear general error only on full refresh
        if (refreshType === 'all') setError(null);

        // Clear task-specific messages if not refreshing tasks
        if (refreshType !== 'tasks') {
            setSuggestTasksError(null);
            setSuggestTasksSuccess('');
        }
        if (!token) { setError("Authentication error: Not logged in."); setIsLoading(false); return; }

        const headers = { 'Authorization': `Bearer ${token}` };
        const baseUrl = 'https://api.goclientwise.com/api/dashboard'; // Base URL for dashboard APIs
        const baseApiUrl = 'https://api.goclientwise.com/api';
        const fetchDataFor = async (url) => {
          const response = await fetch(url, { headers });
          if (!response.ok) {
              let errorMsg = `Error fetching ${url}: ${response.status}`;
              try { const d = await response.json(); errorMsg = d.error || errorMsg; } catch(e){}
              throw new Error(errorMsg);
          }
          return response.json();
      };

        // Helper to fetch individual endpoints
        const fetchApi = async (endpoint) => {
            const response = await fetch(`${baseUrl}/${endpoint}`, { headers });
            if (!response.ok) {
                let errorMsg = `Error fetching ${endpoint}: ${response.status}`;
                try { const d = await response.json(); errorMsg = d.error || errorMsg; } catch(e){}
                throw new Error(errorMsg);
            }
            return response.json();
        };

        try {
          // Fetch all data concurrently
          const results = await Promise.allSettled([
              fetchDataFor(`${baseApiUrl}/dashboard/metrics`),
              fetchDataFor(`${baseApiUrl}/dashboard/tasks?limit=5`),
              fetchDataFor(`${baseApiUrl}/dashboard/activity?limit=5`),
              fetchDataFor(`${baseApiUrl}/agents/goals`),             // Fetch Goals
        
              fetchDataFor(`${baseApiUrl}/agents/my-clients-full-data`), // Fetch Full Client Data
              fetchDataFor("https://api.goclientwise.com/api/agents/sales-performance", setSalesData, true, setIsChartLoading),

            ]);

          // Process results for standard dashboard sections
          let fetchError = null;
          if (results[0].status === 'fulfilled') setMetrics(results[0].value || { policiesSoldThisMonth: 0, upcomingRenewals30d: 0, commissionThisMonth: 0, newLeadsThisWeek: 0 });
              else fetchError = results[0].reason;
          if (results[1].status === 'fulfilled') setTasks(results[1].value || []);
              else fetchError = fetchError || results[1].reason;
          if (results[2].status === 'fulfilled') setActivities(results[2].value || []);
              else fetchError = fetchError || results[2].reason;

          // --- Trigger AI Assign if necessary data loaded ---
          const goalResult = results[3];
          const clientListResult = results[4];

          if (goalResult.status === 'fulfilled' && clientListResult.status === 'fulfilled') {
              // Call AI function with the fetched data
              fetchAiAssignRecommendation(goalResult.value, clientListResult.value);
          } else {
              // Handle error if goals or client data failed to load for AI
              const goalError = goalResult.status === 'rejected' ? goalResult.reason?.message : null;
              const clientListError = clientListResult.status === 'rejected' ? clientListResult.reason?.message : null;
              const aiDataError = [goalError, clientListError].filter(Boolean).join('; ');
              setAiAssignError(`Could not generate AI assignment: Failed to load necessary data (${aiDataError || 'Unknown reason'}).`);
              setIsFetchingAiAssign(false); // Ensure AI loading stops
          }
          // ----------------------------------------------------

          if(fetchError) {
               console.error("Failed to fetch some dashboard data:", fetchError);
               // Set general error only if not already set by AI data fetch failure
               setError(prev => prev || fetchError.message || "An error occurred loading dashboard data.");
          }

      } catch (err) { // Catch errors from Promise.allSettled itself
          console.error("Failed to fetch dashboard data:", err);
          setError(err.message || "An unexpected error occurred.");
          setMetrics({ policiesSoldThisMonth: 0, upcomingRenewals30d: 0, commissionThisMonth: 0, newLeadsThisWeek: 0 });
          setTasks([]); setActivities([]); setAiAssignText(''); setAiAssignError(err.message);
      } finally {
          setIsLoading(false); // Stop overall loading
      }
  }, [fetchAiAssignRecommendation]); // Add callback dependency

  useEffect(() => {
      fetchDashboardData();
  }, [fetchDashboardData]);
    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]); // Depend on the function itself


    const handleSuggestTasks = async () => {
      setIsSuggestingTasks(true);
      setSuggestTasksError(null);
      setSuggestTasksSuccess('');
      const token = localStorage.getItem('authToken');
      if (!token) { setSuggestTasksError("Authentication error."); setIsSuggestingTasks(false); return; }

      console.log("Requesting AI task suggestions...");

      try {
          const response = await fetch(`https://api.goclientwise.com/api/agents/suggest-tasks`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` },
          });
          const result = await response.json();
          if (!response.ok) { throw new Error(result.error || `Failed to get suggestions (${response.status})`); }

          setSuggestTasksSuccess(result.message || "AI tasks suggested successfully!");
          // Refresh the task list displayed on the dashboard
          fetchDashboardData('tasks');

      } catch (err) {
          console.error("Suggest Tasks Error:", err);
          setSuggestTasksError(err.message || "An error occurred while suggesting tasks.");
      } finally {
          setIsSuggestingTasks(false);
      }
  };
  const openClientModal = () => setIsClientModalOpen(true);
    const closeClientModal = () => setIsClientModalOpen(false);
    const handleClientAdded = () => {
        closeClientModal();
        fetchDashboardData('metrics'); // Refresh metrics which might include lead count
        fetchDashboardData('activity'); // Refresh activity log
    };
    // Add handlers for Policy/Task modals if needed from here (though disabled now)
    // const openPolicyModal = () => alert("Add Policy from Client Profile page");
    // const openTaskModal = () => alert("Add Task from Client Profile page");


    // --- Chart Data and Options ---
    const chartData = useMemo(() => {
        const labels = salesData.map(d => d.Month); // Use YYYY-MM from backend
        const dataPoints = salesData.map(d => d.Count);
        return {
            labels,
            datasets: [
                {
                    label: 'Policies Sold per Month',
                    data: dataPoints,
                    borderColor: themeColors.brandPurple,
                    backgroundColor: 'rgba(90, 35, 158, 0.1)', // Lighter purple fill
                    tension: 0.1,
                    fill: true,
                },
            ],
        };
    }, [salesData]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, // Allow chart to fill container height
        plugins: {
            legend: { display: true, position: 'top' },
            title: { display: false }, // Title is in the card header
            tooltip: { mode: 'index', intersect: false },
        },
        scales: {
            y: { beginAtZero: true, ticks: { precision: 0 } }, // Ensure whole numbers for count
        },
    };
    // --- Rendering Logic ---
    // if (isLoading) { return <div className="text-center p-10 text-gray-500"><i className="fas fa-spinner fa-spin text-3xl text-[--brand-purple]"></i><p className="mt-2">Loading Dashboard...</p></div>; }
    // // Show general error if loading finished but we have an error message
    // if (error) { return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4" role="alert"><strong className="font-bold">Error: </strong><span className="block sm:inline">{error}</span></div>; }
 // --- Rendering Logic ---
 if (isLoading && !aiAssignText && !error && !aiAssignError) { // Show main loader only on initial full load
  return <div className="text-center p-10 text-gray-500"><i className="fas fa-spinner fa-spin text-3xl text-[--brand-purple]"></i><p className="mt-2">Loading Dashboard...</p></div>;
}
// Show fatal error only if initial load failed badly
if (error && tasks.length === 0 && activities.length === 0) {
 return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4" role="alert"><strong className="font-bold">Error: </strong><span className="block sm:inline">{error}</span></div>;
}
    return (

        <div className="" style={{'--brand-purple': themeColors.brandPurple}}>
      
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg text-white">
                <h2 className="text-xl font-semibold mb-2 flex items-center">
                    <i className="fas fa-brain mr-2"></i> AI Assist- Your Weekly AI Guide
                </h2>
                {isFetchingAiAssign ? (
                    <div className="flex items-center justify-center p-4">
                        <i className="fas fa-spinner fa-spin text-2xl mr-3"></i> Generating suggestions...
                    </div>
                ) : aiAssignError ? (
                    <div className="text-sm text-red-100 p-2 bg-red-800 bg-opacity-50 border border-red-300 rounded">
                        <strong className="font-bold">Error:</strong> {aiAssignError}
                    </div>
                 ) : aiAssignText ? (
                    <div className="text-sm space-y-2 ai-content">
                         {aiAssignText.split('\n').map((paragraph, index) => {
                             // Basic formatting for potential markdown lists/bold
                             paragraph = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold
                             paragraph = paragraph.replace(/^\* (.*)/gm, '<li class="ml-4 list-disc">$1</li>'); // List items
                             return <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }}></p>;
                         })}
                    </div>
                 ) : (
                     <p className="text-sm text-purple-100 italic">AI assignment suggestions will appear here.</p>
                 )}
            </div>
          
          
            {/* Metric Cards - Now using fetched data */}
          
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            <div className="bg-white p-5 rounded-lg shadow border border-gray-100 animate-on-scroll">
                <div className="flex items-center justify-between">
                    <div> <p className="text-sm font-medium text-gray-500">Policies Sold (Month)</p> <p className="text-2xl font-bold text-gray-800">{metrics.policiesSoldThisMonth}</p> </div>
                    <div className={`p-3 rounded-full ${getIconBgColor('purple')}`}> <i className="fas fa-file-signature fa-lg"></i> </div>
                </div>
                {/* Placeholder for change % */}
                <p className="text-xs text-gray-500 mt-2">vs last month</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow border border-gray-100 animate-on-scroll delay-100">
                <div className="flex items-center justify-between">
                    <div> <p className="text-sm font-medium text-gray-500">Upcoming Renewals (30d)</p> <p className="text-2xl font-bold text-gray-800">{metrics.upcomingRenewals30d}</p> </div>
                    <div className={`p-3 rounded-full ${getIconBgColor('yellow')}`}> <i className="fas fa-calendar-check fa-lg"></i> </div>
                </div>
                <Link to="/dashboard/renewals" className="text-xs text-purple-600 hover:underline mt-2 block">View Renewals</Link>
                </div>
            <div className="bg-white p-5 rounded-lg shadow border border-gray-100 animate-on-scroll delay-200">
                <div className="flex items-center justify-between">
                    <div> <p className="text-sm font-medium text-gray-500">Commission (Month)</p> <p className="text-2xl font-bold text-gray-800">₹{metrics.commissionThisMonth.toLocaleString('en-IN')}</p> </div>
                     <div className={`p-3 rounded-full ${getIconBgColor('green')}`}> <i className="fas fa-rupee-sign fa-lg"></i> </div>
                </div>
                 <p className="text-xs text-gray-500 mt-2">Estimated</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow border border-gray-100 animate-on-scroll delay-300">
                <div className="flex items-center justify-between">
                    <div> <p className="text-sm font-medium text-gray-500">New Leads (Week)</p> <p className="text-2xl font-bold text-gray-800">{metrics.newLeadsThisWeek}</p> </div>
                     <div className={`p-3 rounded-full ${getIconBgColor('blue')}`}> <i className="fas fa-user-plus fa-lg"></i> </div>
                </div>
                 <a href="https://www.goclientwise.in"  className="text-xs text-purple-600 hover:underline mt-2 block">Manage Leads</a>
            </div>

            {/* Upcoming Tasks Card - Now using fetched data */}
            <div className="bg-white p-5 rounded-lg shadow border border-gray-100 md:col-span-2 lg:col-span-2 animate-on-scroll delay-100">
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

             {/* Recent Activity Card - Now using fetched data */}
            <div className="bg-white p-5 rounded-lg shadow border border-gray-100 md:col-span-2 lg:col-span-2 animate-on-scroll delay-200">
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

            {/* Quick Actions Card (Placeholder) */}
            <div className="bg-white p-5 rounded-lg shadow border border-gray-100 lg:col-span-1 xl:col-span-1 animate-on-scroll delay-300">
                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                 <div className="space-y-2">
                 <button onClick={openClientModal} className="w-full text-left text-sm p-2 rounded bg-purple-50 text-purple-700 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-300"><i className="fas fa-user-plus w-4 mr-2"></i>Add New Client</button>
                 <button className="w-full text-left text-sm p-2 rounded bg-purple-50 text-purple-700 hover:bg-purple-100"><a href='/clients'><i className="fas fa-file-medical w-4 mr-2"></i>Add New Polic</a>y</button>
                     {/* <button className="w-full text-left text-sm p-2 rounded bg-purple-50 text-purple-700 hover:bg-purple-100"><i className="fas fa-tasks w-4 mr-2"></i>Add New Task</button> */}
                 </div>
            </div>

             {/* Performance Chart Placeholder */}
                 <div className="bg-white p-5 rounded-lg shadow border border-gray-100 lg:col-span-3 xl:col-span-3">
                     <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Performance (Policies/Month)</h3>
                     <div className="relative h-64 md:h-72"> {/* Set specific height */}
                         {isChartLoading ? (
                             <div className="absolute inset-0 flex items-center justify-center text-gray-500"><i className="fas fa-spinner fa-spin mr-2"></i>Loading Chart...</div>
                         ) : chartError ? (
                              <div className="absolute inset-0 flex items-center justify-center text-red-500 text-sm">{chartError}</div>
                         ) : salesData.length > 0 ? (
                            <Line options={chartOptions} data={chartData} />
                         ) : (
                             <div className="absolute inset-0 flex items-center justify-center text-gray-500 italic">No sales data available for the last 12 months.</div>
                         )}
                     </div>

                 </div>
             <AddClientModal
                isOpen={isClientModalOpen}
                onClose={closeClientModal}
                onClientAdded={handleClientAdded}
            />
        </div></div>
      );
    };

// If saving as a separate file:
export default DashboardOverview;
