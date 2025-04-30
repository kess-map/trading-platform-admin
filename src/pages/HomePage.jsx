import { motion } from "framer-motion";
import { useAdminStore } from "../store/adminStore";
import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import axios from '../utils/axios'
const HomePage = () => {
	const { user } = useAdminStore();
	const [dashboardMetrics, setDashboardMetrics] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchMetrics = async () => {
			setLoading(true);
			try {
				const response = await axios.get("/admin");
				setDashboardMetrics(response.data.data);
			} catch (error) {
				console.error("Error fetching metrics", error);
				setError("Failed to fetch dashboard metrics");
			} finally {
				setLoading(false);
			}
		};

		fetchMetrics();
	}, []);

	const metrics = dashboardMetrics ? [
		{ title: "Total Users", value: dashboardMetrics.users.total || 0 },
		{ title: "Total Buy Orders", value: dashboardMetrics.orders.buy.total || 0 },
		{ title: "Total Sell Orders", value: dashboardMetrics.orders.sell.total || 0 },
		{ title: "Pending Buy Orders", value: dashboardMetrics.orders.buy.pending || 0 },
		{ title: "Pending Sell Orders", value: dashboardMetrics.orders.sell.pending || 0 },
		{ title: "Total Matched Orders", value: dashboardMetrics.orders.matched.total || 0 },
		{ title: "Successful Matched Orders", value: dashboardMetrics.orders.matched.successful || 0 },
		{ title: "Active Investments", value: dashboardMetrics.investments.active || 0 },
		{ title: "Total Investment Amount", value: `₦${dashboardMetrics.investments.totalAmount || 0}` },
	  ] : [];

	  if(loading) return <LoadingSpinner/>

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.9 }}
			transition={{ duration: 0.5 }}
			className=' w-full mx-auto p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800'
		>
			<h2 className='text-3xl font-bold mb-6 text-start bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text'>
				What's up, {user.fullName}
			</h2>

			{/* <div className='space-y-6'>
				<motion.div
					className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
				</motion.div>
			</div> */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            className="p-6 bg-gray-800 bg-opacity-60 rounded-lg border border-gray-700 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <h4 className="text-sm text-gray-400">{metric.title}</h4>
            <p className="text-2xl font-semibold text-white mt-2">{metric.value}</p>
          </motion.div>
        ))}
      </div>
		</motion.div>
	);
};
export default HomePage;