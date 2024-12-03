import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CustomerSupport = () => {
    const [response, setResponse] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState("");

    const questions = [
        'What is the best sale offer on Daraz 11.11?',
        'How can I start selling on Daraz?',
        'What are the Popular Things on Daraz?',
        'Is cash on delivery better than online payment?',
    ];

    const handleSubmit = async (query) => {
        setIsLoading(true);
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
        console.log("API Key:", apiKey);

        if (!apiKey) {
        console.error("API Key is missing or not loaded.");
        setResponse("Error: Missing API key.");
        setIsLoading(false);
        return;
        }

        try {
        const payload = {
            model: "llama3-8b-8192",
            messages: [{ role: "user", content: query }],
        };

        const result = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify(payload),
            }
        );

        if (!result.ok) {
            throw new Error(`API Error: ${result.statusText}`);
        }

        const data = await result.json();
        setResponse(data.choices[0].message.content);
        } catch (error) {
        console.error("Error during API call:", error);
        setResponse("Sorry, there was an error processing your request.");
        } finally {
        setIsLoading(false);
        }
    };

    const handleQueryChange = (e) => setQuery(e.target.value);

    const handlePredefinedQuestionClick = (question) => {
        setQuery(question);
        handleSubmit(question);
    };

    useEffect(() => {
        const handleKeyPress = (event) => {
        if (event.key === 'Enter' && query.trim()) {
            handleSubmit(query);
        }
        };

        document.addEventListener('keypress', handleKeyPress);
        return () => {
        document.removeEventListener('keypress', handleKeyPress);
        };
    }, [query]);

    return (
        <div className="min-h-screen  text-gray-300 flex flex-col">
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-8"
        >
            <h1 className="text-4xl md:text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">
            Customer Support
            </h1>
        </motion.div>
        <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
            <motion.form
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={(e) => {
                e.preventDefault();
                if (query.trim()) {
                handleSubmit(query);
                }
            }}
            className="mb-8"
            >
            <div className="flex shadow-lg">
                <input
                type="text"
                value={query}
                onChange={handleQueryChange}
                placeholder="Enter your question here..."
                className="flex-grow px-6 py-4 bg-gray-700 text-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg transition-all duration-300"
                />
                <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-r-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 text-lg"
                >
                {isLoading ? (
                    <span className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></span>
                ) : (
                    "Ask"
                )}
                </button>
            </div>
            </motion.form>

            <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8"
            >
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">
                Common Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions.map((question, index) => (
                <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePredefinedQuestionClick(question)}
                    className="text-left px-6 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-md"
                >
                    {question}
                </motion.button>
                ))}
            </div>
            </motion.div>

            <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="rounded-lg p-6 min-h-[200px] transition-all duration-300 ease-in-out bg-gray-700 shadow-xl"
            >
            <AnimatePresence mode="wait">
                {isLoading ? (
                <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center items-center h-full"
                >
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
                </motion.div>
                ) : response ? (
                <motion.div
                    key="response"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-gray-300 space-y-4"
                >
                    <p className="text-lg leading-relaxed">{response}</p>
                </motion.div>
                ) : (
                <motion.p
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-gray-400 italic text-lg text-center"
                >
                    Your response will appear here...
                </motion.p>
                )}
            </AnimatePresence>
            </motion.div>
        </main>
        <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center py-4 text-gray-500 text-sm"
        >
            © 2024  Customer Support. All rights reserved.
        </motion.footer>
        </div>
    );
};

export default CustomerSupport;

