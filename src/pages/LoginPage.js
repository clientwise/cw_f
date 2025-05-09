import React, { useState, useEffect } from 'react';
import InputField from '../components/common/InputField'; // Adjust path as needed
import Button from '../components/common/Button'; // Adjust path as needed

// Assume themeColors is available globally or via context/props
const themeColors = { brandPurple: '#5a239e', brandPurpleHover: '#703abc', green100: '#dcfce7', green700: '#15803d', red100: '#fee2e2', red700: '#b91c1c' };

const LoginPage = ({ navigateToLanding, initialMode = 'login', onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState('agent');
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('verified') === 'true') { setMessage('Email verified successfully! Please log in.'); setIsSignUp(false); window.history.replaceState(null, '', window.location.pathname); }
    if (queryParams.get('reset') === 'success') { setMessage('Password reset successfully! Please log in.'); setIsSignUp(false); window.history.replaceState(null, '', window.location.pathname); }
    setIsSignUp(initialMode === 'signup');
  }, [initialMode]);

  const handleApiCall = async (endpoint, payload) => {
      setIsLoading(true); setMessage('');
      try {
          const response = await fetch(`https://api.goclientwise.com${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || `HTTP error! status: ${response.status}`);
          if (endpoint === '/login') { onLoginSuccess(data); } // Call parent on success
          else if(endpoint === '/signup') { setMessage(data.message || 'Signup successful! Please check verification email.'); setIsSignUp(false); }
          else { setMessage(data.message || 'Request successful.'); }
      } catch (error) { console.error("API Error:", error); setMessage(`Error: ${error.message}`);
      } finally { setIsLoading(false); }
  };

  const handleSubmit = (event) => { event.preventDefault(); const endpoint = isSignUp ? '/signup' : '/login'; const payload = { email, password, userType: loginType }; handleApiCall(endpoint, payload); };
  const handleForgotPassword = () => { if (!email) { setMessage('Error: Please enter your email address first.'); return; } handleApiCall('/forgot-password', { email }); }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-yellow-50 p-4 font-sans" style={{'--brand-purple': themeColors.brandPurple, '--brand-purple-hover': themeColors.brandPurpleHover }}>
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md relative">
         <button onClick={navigateToLanding} className="absolute top-4 left-4 text-gray-500 hover:text-[--brand-purple]" title="Back to Landing Page"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></button>
        <div className="text-center mb-6 pt-4"> <a href="https://www.goclientwise.com" className="text-3xl font-semibold text-[--brand-purple] hover:text-[--brand-purple-hover] transition-colors">clientwise</a> <h2 className="mt-2 text-xl font-semibold text-gray-700">{isSignUp ? 'Create Account' : 'Login'}</h2> </div>
        {message && (<div className={`mb-4 p-3 rounded-md text-sm ${message.startsWith('Error:') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message}</div>)}
        <form onSubmit={handleSubmit}>
          <div className="mb-6"> <label className="block text-sm font-medium text-gray-700 mb-2 text-center">I am an:</label> <div className="flex justify-center space-x-4"> <label htmlFor="agent" className={`flex items-center space-x-2 cursor-pointer p-2 border rounded-md transition-colors duration-150 ${loginType === 'agent' ? 'border-[--brand-purple] bg-purple-50' : 'border-gray-300'}`}> <input type="radio" id="agent" name="loginType" value="agent" checked={loginType === 'agent'} onChange={() => setLoginType('agent')} className="h-4 w-4 text-[--brand-purple] focus:ring-0 border-gray-300" /> <span className={`text-sm font-medium ${loginType === 'agent' ? 'text-[--brand-purple]' : 'text-gray-600'}`}>Agent</span> </label> <label htmlFor="agency" className={`flex items-center space-x-2 cursor-pointer p-2 border rounded-md transition-colors duration-150 ${loginType === 'agency' ? 'border-[--brand-purple] bg-purple-50' : 'border-gray-300'}`}> <input type="radio" id="agency" name="loginType" value="agency" checked={loginType === 'agency'} onChange={() => setLoginType('agency')} className="h-4 w-4 text-[--brand-purple] focus:ring-0 border-gray-300" /> <span className={`text-sm font-medium ${loginType === 'agency' ? 'text-[--brand-purple]' : 'text-gray-600'}`}>Agency</span> </label> </div> </div>
          <InputField id="email" label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          <InputField id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          {!isSignUp && ( <div className="text-right mb-6"> <button type="button" onClick={handleForgotPassword} disabled={isLoading} className="text-sm font-medium text-[--brand-purple] hover:text-[--brand-purple-hover] disabled:opacity-50">Forgot Password?</button> </div> )}
          <Button
  type="submit"
  className="w-full bg-[#5a239e] text-white border-[#5a239e] hover:bg-[#703abc] hover:border-[#703abc]"
  disabled={isLoading}
>
  {isLoading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Login')}
</Button>

          <div className="mt-6 text-center"> <p className="text-sm text-gray-600"> {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '} <button type="button" onClick={() => { setIsSignUp(!isSignUp); setMessage(''); }} className="font-medium text-[--brand-purple] hover:text-[--brand-purple-hover]"> {isSignUp ? 'Login' : 'Sign Up'} </button> </p> </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
