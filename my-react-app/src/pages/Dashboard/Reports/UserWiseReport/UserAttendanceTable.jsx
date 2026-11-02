import "./UserAttendanceTable.css";

import {
  FaFileExcel,
  FaFilePdf,
  FaPrint
} from "react-icons/fa";

function UserAttendanceTable({ attendance = [] }) {


  // ------------------------------------------------
  // PRINT
  // ------------------------------------------------

  const handlePrint = () => {
    window.print();
  };


  // ------------------------------------------------
  // EXPORT EXCEL
  // ------------------------------------------------

  const handleExcelExport = () => {

    if (!attendance.length) {
      alert("No attendance data to export.");
      return;
    }

    const headers = [
      "Date",
      "Entry Time",
      "Exit Time",
      "Working Hours",
      "Method",
      "Status",
      "Remarks"
    ];

    const rows = attendance.map((item) => [
      item.date,
      item.entry,
      item.exit,
      item.hours,
      item.method,
      item.status,
      item.remarks
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((value) =>
          `"${value ?? ""}"`
        ).join(",")
      )
    ].join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;"
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "user-attendance.csv";

    link.click();

    URL.revokeObjectURL(url);
  };


  // ------------------------------------------------
  // PDF
  // ------------------------------------------------

  const handlePdfExport = () => {

    alert(
      "PDF export can be connected to your Flask PDF report API."
    );

  };


  return (

    <div className="attendanceTableCard">

      {/* HEADER */}

      <div className="tableHeader">

        <div>

          <h3>
            Attendance Details
          </h3>

          <p>
            Daily attendance records of selected user
          </p>

        </div>


        <div className="exportButtons">

          <button
            className="excelBtn"
            onClick={handleExcelExport}
          >

            <FaFileExcel />

            Export Excel

          </button>


          <button
            className="pdfBtn"
            onClick={handlePdfExport}
          >

            <FaFilePdf />

            Export PDF

          </button>


          <button
            className="printBtn"
            onClick={handlePrint}
          >

            <FaPrint />

            Print

          </button>

        </div>

      </div>


      {/* TABLE */}

      <div className="tableResponsive">

        <table>

          <thead>

            <tr>

              <th>
                #
              </th>

              <th>
                Date
              </th>

              <th>
                Entry Time
              </th>

              <th>
                Exit Time
              </th>

              <th>
                Working Hours
              </th>

              <th>
                Method
              </th>

              <th>
                Status
              </th>

              <th>
                Remarks
              </th>

            </tr>

          </thead>


          <tbody>

            {attendance.length > 0 ? (

              attendance.map((item, index) => (

                <tr key={item.id || index}>

                  <td>
                    {index + 1}
                  </td>

                  <td>
                    {item.date || "--"}
                  </td>

                  <td>
                    {item.entry || "--"}
                  </td>

                  <td>
                    {item.exit || "--"}
                  </td>

                  <td>
                    {item.hours || "--"}
                  </td>

                  <td>

                    <span
                      className={
                        item.method === "NFC"
                          ? "methodNFC"
                          : item.method === "Face"
                            ? "methodFace"
                            : "methodNone"
                      }
                    >
                      {item.method || "--"}
                    </span>

                  </td>

                  <td>
                    {item.status || "--"}
                  </td>

                  <td>
                    {item.remarks || "--"}
                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: "30px"
                  }}
                >
                  No attendance records found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>


      {/* FOOTER */}

      <div className="tableFooter">

        <p>
          Showing <b>{attendance.length}</b> attendance records
        </p>

      </div>

    </div>

  );
}

export default UserAttendanceTable;