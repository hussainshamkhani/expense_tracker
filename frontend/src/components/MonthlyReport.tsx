import { useState } from "react";

const API_URL = "http://localhost:8000";

function MonthlyReport() {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [isDownloading, setIsDownloading] = useState(false);

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(
        `${API_URL}/monthly_report/${selectedMonth}/${selectedYear}`
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `expenses_${selectedMonth}_${selectedYear}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Failed to generate report");
      }
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Error connecting to server. Make sure the backend is running.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="monthly-report-card">
      <h2>Monthly Report</h2>
      <p className="report-description">Generate and download expense reports by month</p>

      <div className="report-selectors">
        <div className="form-group">
          <label htmlFor="month-select">Month</label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="year-select">Year</label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        className="download-btn"
        onClick={handleDownloadReport}
        disabled={isDownloading}
      >
        {isDownloading ? "Generating..." : "Download Report"}
      </button>
    </div>
  );
}

export default MonthlyReport;
