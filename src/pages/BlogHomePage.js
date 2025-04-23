import React from 'react';
import { Link } from 'react-router-dom';
import Header from  '../components/layout/Header';
import Footer from '../components/layout/Footer';
// Sample Blog Post Data (replace with actual data source later)
const blogPosts = [
    {
        id: '1',
        title: '5 Ways CRM Boosts Insurance Agent Productivity',
        slug: 'crm-productivity-boost',
        excerpt: 'Learn how leveraging a CRM like ClientWise can significantly reduce administrative tasks and free up time for selling...',
        date: 'April 20, 2025',
        author: 'ClientWise Team',
        imageUrl: 'https://placehold.co/600x400/5a239e/ffffff?text=CRM+Boost',
    },
    {
        id: '2',
        title: 'Understanding the Importance of Needs Analysis in Insurance Sales',
        slug: 'needs-analysis-importance',
        excerpt: 'A deep dive into why a thorough needs analysis is crucial for building trust and providing the right solutions to clients...',
        date: 'April 15, 2025',
        author: 'Industry Expert',
        imageUrl: 'https://placehold.co/600x400/a78bfa/ffffff?text=Needs+Analysis',
    },
    {
         id: '3',
         title: 'Navigating Digital Marketing for Insurance Agents in India',
         slug: 'digital-marketing-agents-india',
         excerpt: 'Tips and strategies for using online channels effectively to generate leads and build your brand...',
         date: 'April 10, 2025',
         author: 'Marketing Pro',
         imageUrl: 'https://placehold.co/600x400/8b5cf6/ffffff?text=Digital+Marketing',
    },
];

const BlogHomePage = () => {
    return (
        <div >
            <Header></Header>
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">ClientWise Blog</h1>
                <p className="text-center text-gray-600 mb-12">Insights, tips, and updates for insurance professionals.</p>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {blogPosts.map((post) => (
                        <div key={post.id} className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
                            <img src={post.imageUrl} alt={post.title} className="h-48 w-full object-cover" />
                            <div className="p-6 flex flex-col flex-grow">
                                <h2 className="text-lg font-semibold text-gray-800 mb-2 hover:text-purple-700">
                                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                                </h2>
                                <p className="text-sm text-gray-600 mb-4 flex-grow">{post.excerpt}</p>
                                <div className="text-xs text-gray-500 mt-auto">
                                    <span>By {post.author}</span> | <span>{post.date}</span>
                                </div>
                                <Link to={`/blog/${post.slug}`} className="text-sm text-purple-600 hover:text-purple-800 font-medium mt-4 inline-block">
                                    Read More &rarr;
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                 <div className="mt-12 text-center">
                    <Link to="/" className="text-indigo-600 hover:text-indigo-800 text-sm">
                        &larr; Back to Home
                    </Link>
                </div>
            </div></div>
            <Footer></Footer>
        </div>
    );
};

export default BlogHomePage;
