import "./VisitorModal.css";

function VisitorModal({ visitor, onClose }) {

    return (

        <div className="modalOverlay">

            <div className="modal">

                <h2>Visitor Details</h2>

    {/*             <img
                    src={visitor.faceCaptured}
                    alt="Profile Image"
                    className="profileImage"
                /> */}

                <table>

                    <tbody>

                        <tr>
                            <td><b>ID</b></td>
                            <td>{visitor.visitorID}</td>
                        </tr>

                        <tr>
                            <td><b>Name</b></td>
                            <td>{visitor.visitorName}</td>
                        </tr>

                        <tr>
                            <td><b>Mobile</b></td>
                            <td>{visitor.contactNo}</td>
                        </tr>

                        <tr>
                            <td><b>Email</b></td>
                            <td>{visitor.email}</td>
                        </tr>

                        <tr>
                            <td><b>Entry Time</b></td>
                            <td>{ visitor.createdDate
                                                    ? new Date(
                                                        visitor.createdDate
                                                    ).toLocaleString()
                                                    : "-"}</td>
                        </tr>

                     

                     
                       

                    </tbody>

                </table>

                <button
                    className="closeBtn"
                    onClick={onClose}
                >
                    Close
                </button>

            </div>

        </div>

    );

}

export default VisitorModal;
