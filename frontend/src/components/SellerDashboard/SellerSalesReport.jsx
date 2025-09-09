// src/components/SellerDashboard/SellerSalesReport.jsx
import React, { useEffect, useState } from "react";
import { fetchSalesReport } from "../../api/salesReportService";

const SellerSalesReport = () => {
  const authData = JSON.parse(sessionStorage.getItem("authData"));
  const sellerId = authData?.data?.user?.user_id;

  const [report, setReport] = useState(null);

  useEffect(() => {
    const loadReport = async () => {
      try {
        const data = await fetchSalesReport(sellerId);
        setReport(data);
      } catch (error) {
        console.error("Error fetching sales report:", error);
      }
    };
    loadReport();
  }, [sellerId]);

  if (!report) {
    return <div>Loading sales report...</div>;
  }

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">Sales Report</h2>
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gradient-to-r from-green-500 to-teal-500 text-white uppercase text-sm leading-normal">
            <th className="p-3 text-left">Product ID</th>
            <th className="p-3 text-left">Product Name</th>
            <th className="p-3 text-left">Order Count</th>
            <th className="p-3 text-left">Items Sold</th>
            <th className="p-3 text-left">Revenue</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {report.productSales && report.productSales.length > 0 ? (
            report.productSales.map((ps) => (
              <tr
                key={ps.productId}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="p-3">{ps.productId}</td>
                <td className="p-3">{ps.productName}</td>
                <td className="p-3">{ps.orderCount}</td>
                <td className="p-3">{ps.itemsSold}</td>
                <td className="p-3">₹{ps.revenue}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="p-3 text-center">
                No product sales data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SellerSalesReport;
