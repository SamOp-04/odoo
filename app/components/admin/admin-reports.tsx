'use client';

import React, { useState } from 'react';

interface Report {
  id: string;
  name: string;
  description: string;
  icon: string;
  generatedDate?: string;
}

const AdminReports = () => {
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      name: 'Sales Report',
      description: 'Monthly sales summary and trends',
      icon: '📊',
    },
    {
      id: '2',
      name: 'Customer Report',
      description: 'Customer activity and engagement metrics',
      icon: '👥',
    },
    {
      id: '3',
      name: 'Vendor Performance',
      description: 'Vendor sales and performance analysis',
      icon: '🏪',
    },
    {
      id: '4',
      name: 'Rental Statistics',
      description: 'Equipment rental trends and patterns',
      icon: '⏱️',
    },
    {
      id: '5',
      name: 'Revenue Analysis',
      description: 'Detailed revenue breakdown by category',
      icon: '💰',
    },
    {
      id: '6',
      name: 'Inventory Report',
      description: 'Current inventory levels and status',
      icon: '📦',
    },
  ]);

  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [dateRange, setDateRange] = useState({
    startDate: '2024-01-01',
    endDate: '2024-01-31',
  });

  const handleSelectReport = (reportId: string) => {
    if (selectedReports.includes(reportId)) {
      setSelectedReports(selectedReports.filter(id => id !== reportId));
    } else {
      setSelectedReports([...selectedReports, reportId]);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedReports(reports.map(r => r.id));
    } else {
      setSelectedReports([]);
    }
  };

  const handleExport = () => {
    if (selectedReports.length === 0) {
      alert('Please select at least one report to export');
      return;
    }

    const exportData = {
      format: exportFormat,
      reports: selectedReports,
      dateRange,
      generatedAt: new Date().toISOString(),
    };

    console.log('Exporting:', exportData);
    alert(`Exporting ${selectedReports.length} report(s) as ${exportFormat.toUpperCase()}...`);
  };

  const handleDownloadSample = (format: string) => {
    alert(`Downloading sample ${format.toUpperCase()} report...`);
  };

  const sampleReports = [
    {
      title: 'Monthly Sales Report',
      icon: '📈',
      description: 'Summary of sales performance for the month',
      formats: ['PDF', 'Excel', 'CSV'],
    },
    {
      title: 'Customer Analytics',
      icon: '📊',
      description: 'Detailed customer engagement metrics',
      formats: ['PDF', 'Excel', 'CSV'],
    },
    {
      title: 'Inventory Status',
      icon: '📋',
      description: 'Current status of all rental items',
      formats: ['PDF', 'Excel', 'CSV'],
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>

      {/* Export Section */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Generate & Download Reports</h2>

        {/* Date Range Selector */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Select Date Range</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-pink-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-pink-600"
              />
            </div>
          </div>
        </div>

        {/* Report Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Select Reports</h3>
          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedReports.length === reports.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-white font-medium">Select All Reports</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((report) => (
              <label
                key={report.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                  selectedReports.includes(report.id)
                    ? 'border-pink-600 bg-gray-600'
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedReports.includes(report.id)}
                    onChange={() => handleSelectReport(report.id)}
                    className="w-4 h-4 rounded mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{report.icon}</span>
                      <h4 className="font-semibold text-white">{report.name}</h4>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{report.description}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Export Format Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Export Format</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['pdf', 'excel', 'csv'] as const).map((format) => (
              <label
                key={format}
                className={`p-4 rounded-lg border-2 cursor-pointer transition flex items-center gap-3 ${
                  exportFormat === format
                    ? 'border-pink-600 bg-gray-600'
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value={format}
                  checked={exportFormat === format}
                  onChange={(e) => setExportFormat(e.target.value as any)}
                  className="w-4 h-4"
                />
                <div>
                  <p className="font-semibold text-white uppercase">{format === 'excel' ? 'Excel (.xlsx)' : format === 'csv' ? 'CSV (.csv)' : 'PDF (.pdf)'}</p>
                  <p className="text-xs text-gray-400">
                    {format === 'excel' ? 'For spreadsheets' : format === 'csv' ? 'For data import' : 'For printing'}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Export Button */}
        <div className="flex gap-4">
          <button
            onClick={handleExport}
            className="px-6 py-3 rounded-lg bg-pink-600 hover:bg-pink-700 transition text-white font-bold flex items-center gap-2"
          >
            📥 Download {exportFormat.toUpperCase()}
          </button>
          <button
            onClick={() => {
              setSelectedReports([]);
              setExportFormat('pdf');
            }}
            className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-white font-medium"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Sample Reports */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Available Sample Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleReports.map((report, idx) => (
            <div key={idx} className="bg-gray-700 rounded-lg p-6">
              <div className="text-4xl mb-3">{report.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{report.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{report.description}</p>
              <div className="space-y-2">
                {report.formats.map((format) => (
                  <button
                    key={format}
                    onClick={() => handleDownloadSample(format)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 transition text-white text-sm font-medium"
                  >
                    Download {format}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Recently Generated</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Report Name</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Generated Date</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Format</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Sales Report - January', date: '2024-01-31', format: 'PDF' },
                { name: 'Customer Analytics', date: '2024-01-30', format: 'Excel' },
                { name: 'Inventory Status', date: '2024-01-28', format: 'CSV' },
              ].map((item, idx) => (
                <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700 transition">
                  <td className="py-3 px-4 text-white font-medium">{item.name}</td>
                  <td className="py-3 px-4 text-gray-300 text-sm">{item.date}</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-blue-100">
                      {item.format}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-white text-sm mr-2">
                      📥 Download
                    </button>
                    <button className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 transition text-white text-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
