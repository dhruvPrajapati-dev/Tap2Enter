import "./UserManagement.css";
import { useState } from "react";
import { FaUsers, FaUserPlus } from "react-icons/fa";

import UserFilter from "./UserFilter";
import UserTable from "./UserTable";
import ViewUserModal from "./ViewUserModal";
import EditUser from "./EditUser";
import AddUser from "./AddUser";

function UserManagement() {

  // =====================================================
  // FILTER STATE
  // =====================================================

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedStatus, setAppliedStatus] = useState("All");


  // =====================================================
  // VIEW USER
  // =====================================================

  const [selectedUser, setSelectedUser] = useState(null);
  const [openView, setOpenView] = useState(false);


  // =====================================================
  // EDIT USER
  // =====================================================

  const [openEdit, setOpenEdit] = useState(false);


  // =====================================================
  // ADD USER
  // =====================================================

  const [openAdd, setOpenAdd] = useState(false);


  // =====================================================
  // APPLY FILTER
  // =====================================================

  const handleSearch = () => {

    setAppliedSearch(search.trim());
    setAppliedStatus(status);

  };


  // =====================================================
  // RESET FILTER
  // =====================================================

  const handleReset = () => {

    setSearch("");
    setStatus("All");

    setAppliedSearch("");
    setAppliedStatus("All");

  };


  // =====================================================
  // VIEW
  // =====================================================

  const handleView = (user) => {

    setSelectedUser(user);
    setOpenView(true);

  };


  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (user) => {

    setSelectedUser(user);
    setOpenEdit(true);

  };


  // =====================================================
  // CLOSE EDIT
  // =====================================================

  const closeEdit = () => {

    setOpenEdit(false);
    setSelectedUser(null);

  };


  // =====================================================
  // ADD USER PAGE
  // =====================================================

  if (openAdd) {

    return (
      <AddUser
        onClose={() => setOpenAdd(false)}
      />
    );

  }


  // =====================================================
  // EDIT USER PAGE
  // =====================================================

  if (openEdit) {

    return (
      <EditUser
        user={selectedUser}
        onClose={closeEdit}
      />
    );

  }


  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (

    <div className="user-management">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="page-header">

        <div className="title-section">

          <div className="title-icon">
            <FaUsers />
          </div>

          <div>
            <h2>User Management</h2>

            <p>
              Manage all registered users in the system
            </p>
          </div>

        </div>


        {/* ADD USER */}

        <button
          className="add-user-btn"
          onClick={() => setOpenAdd(true)}
        >

          <FaUserPlus />

          Add New User

        </button>

      </div>


      {/* =================================================
          FILTER
      ================================================= */}

      <UserFilter
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        onSearch={handleSearch}
        onReset={handleReset}
      />


      {/* =================================================
          USER TABLE
      ================================================= */}

      <UserTable
        onView={handleView}
        onEdit={handleEdit}
        search={appliedSearch}
        status={appliedStatus}
      />


      {/* =================================================
          VIEW USER MODAL
      ================================================= */}

      <ViewUserModal
        isOpen={openView}
        onClose={() => {
          setOpenView(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

    </div>

  );
}

export default UserManagement;