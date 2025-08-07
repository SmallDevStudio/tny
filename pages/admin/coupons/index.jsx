import React, { useState, useEffect } from "react";
import useLanguage from "@/hooks/useLanguage";
import Image from "next/image";
import { DataGrid } from "@mui/x-data-grid";
import { Dialog, Slide, Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { db } from "@/services/firebase"; // Ensure you have your Firebase config set up
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import CouponForm from "@/components/Coupons/CouponForm";
import moment from "moment";
import "moment/locale/th"; // Adjust locale as needed

moment.locale("th"); // Set the locale to Thai, adjust as needed

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CouponsPage() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "coupons"));
        const couponsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCoupons(couponsData);
      } catch (error) {
        console.error("Error fetching coupons:", error);
        toast.error(t("Error fetching coupons"));
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const handleDeleteCoupon = async () => {};

  const handleOpenDialog = () => {
    setSelectedCoupon(null);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedCoupon(null);
    setOpenDeleteDialog(false);
  };

  console.log("Coupons:", coupons);

  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "code", headerName: "code", width: 200 },
    {
      field: "conditions",
      headerName: "Conditions",
      width: 250,
      renderCell: (params) => {
        const { discount, discountUnit, firstTime, limitValue, oneTime } =
          params.value || {};

        return (
          <ul className="text-xs list-disc pl-4 whitespace-normal">
            <li>
              Discount: {discount} {discountUnit === "percent" ? "%" : "baht"}
            </li>
            <li>Limit Value: {limitValue}</li>
            <li>First Time: {firstTime ? "Yes" : "No"}</li>
            <li>One Time: {oneTime ? "Yes" : "No"}</li>
          </ul>
        );
      },
    },
    {
      field: "startDate",
      headerName: "Start Date",
      width: 200,
      valueFormatter: (params) => moment(params.value).format("ll"),
    },
    {
      field: "expiryDate",
      headerName: "Expiry Date",
      width: 200,
      valueFormatter: (params) => moment(params.value).format("ll"),
    },
    {
      field: "active",
      headerName: "Active",
      width: 150,
      renderCell: (params) => (
        <span
          className={`px-2 py-1 rounded-lg cursor-pointer ${
            params.value ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {params.value ? lang["active"] : lang["inactive"]}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <div className="flex space-x-2">
          <Tooltip title={t("Edit")}>
            <button
              className="text-blue-500 hover:text-blue-700"
              onClick={() =>
                router.push(`/admin/coupons/edit/${params.row.id}`)
              }
            >
              {t("Edit")}
            </button>
          </Tooltip>
          <Tooltip title={t("Delete")}>
            <button className="text-red-500 hover:text-red-700">
              {t("Delete")}
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800">
      <div className="max-w-screen px-4">
        <div className="px-4 py-2 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {"Coupons Management"}
          </h1>
        </div>

        <div className="overflow-x-auto mt-4">
          {/* Toolbar */}
          <div>
            <button
              onClick={handleOpenDialog}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 mb-4"
            >
              {"Create New Coupon"}
            </button>
          </div>
          <DataGrid
            rows={coupons}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            getRowHeight={() => "auto"}
            loading={loading}
            disableSelectionOnClick
          />
        </div>
        <Dialog
          open={openDeleteDialog}
          TransitionComponent={Transition}
          onClose={handleCloseDialog}
          aria-describedby="alert-dialog-slide-description"
        >
          <CouponForm onClose={handleCloseDialog} />
        </Dialog>
      </div>
    </div>
  );
}
