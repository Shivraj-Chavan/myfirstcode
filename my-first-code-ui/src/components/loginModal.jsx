import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import ENDPOINT from "../lib/endpoints";

const LoginModal = ({
  setShowModal,
  setIsLoggedIn,
}) => {

  const navigate =
    useNavigate();

  // ================= STATES =================

  const [isRegister,
    setIsRegister] =
    useState(false);

  const [loading,
    setLoading] =
    useState(false);

  const [otpSent,
    setOtpSent] =
    useState(false);

  const [loginOtpSent,
    setLoginOtpSent] =
    useState(false);

  const [showOtp,
    setShowOtp] =
    useState("");

  const [otp,
    setOtp] =
    useState("");

  const [form,
    setForm] =
    useState({
      name: "",
      email: "",
      role: "student",
      standard: "",
    });

  // ================= REDIRECT =================

  const handleRedirect = (
    role
  ) => {

    if (
      role === "student"
    ) {

      navigate("/student");

    } else if (
      role === "teacher"
    ) {

      navigate("/teacher");

    } else if (
      role === "admin"
    ) {

      navigate("/admin");

    }
  };

  // ================= REGISTER =================

  const register = async () => {

    try {

      if (
        !form.name ||
        !form.email ||
        !form.role
      ) {

        return alert(
          "Please fill all fields"
        );
      }

      if (
        form.role ===
          "student" &&
        !form.standard
      ) {

        return alert(
          "Please select standard"
        );
      }

      setLoading(true);

      const res =
        await axios.post(
          ENDPOINT.REGISTER,
          {
            name:
              form.name,

            email:
              form.email,

            role:
              form.role,

            standard:
              form.role ===
              "student"
                ? form.standard
                : null,
          }
        );

      alert(
        res.data.message
      );

      setOtpSent(true);

      setShowOtp(
        res.data.otp
      );

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data
          ?.message ||
          "Register Failed"
      );

    } finally {

      setLoading(false);

    }
  };

  // ================= VERIFY REGISTER OTP =================

  const verifyOtp =
    async () => {

      try {

        if (!otp) {

          return alert(
            "Enter OTP"
          );
        }

        setLoading(true);

        const res =
          await axios.post(
            ENDPOINT.VERIFY_OTP,
            {
              email:
                form.email,
              otp,
            }
          );

        localStorage.setItem(
          "token",
          res.data.token
        );

        localStorage.setItem(
          "role",
          res.data.user.role
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            res.data.user
          )
        );

        alert(
          "Registration Successful"
        );

        setIsLoggedIn(true);

        setShowModal(false);

        handleRedirect(
          res.data.user.role
        );

      } catch (error) {

        console.log(error);

        alert(
          error.response?.data
            ?.message ||
            "OTP Verification Failed"
        );

      } finally {

        setLoading(false);

      }
    };

  // ================= SEND LOGIN OTP =================

  const sendLoginOtp =
    async () => {

      try {

        if (
          !form.email
        ) {

          return alert(
            "Enter Email"
          );
        }

        setLoading(true);

        const res =
          await axios.post(
            ENDPOINT.LOGIN,
            {
              email:
                form.email,
            }
          );

        alert(
          res.data.message
        );

        setLoginOtpSent(true);

        setShowOtp(
          res.data.otp
        );

      } catch (error) {

        console.log(error);

        alert(
          error.response?.data
            ?.message ||
            "Failed To Send OTP"
        );

      } finally {

        setLoading(false);

      }
    };

  // ================= LOGIN =================

  const login = async () => {

    try {

      if (
        !form.email ||
        !otp
      ) {

        return alert(
          "Enter OTP"
        );
      }

      setLoading(true);

      const res =
        await axios.post(
          ENDPOINT.VERIFY_OTP,
          {
            email:
              form.email,
            otp,
          }
        );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "role",
        res.data.user.role
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          res.data.user
        )
      );

      alert(
        "Login Successful"
      );

      setIsLoggedIn(true);

      setShowModal(false);

      handleRedirect(
        res.data.user.role
      );

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data
          ?.message ||
        "Login Failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white w-[420px] rounded-2xl p-8 shadow-2xl relative">

        {/* CLOSE */}

        <button
          onClick={() =>
            setShowModal(false)
          }
          className="absolute top-4 right-5 text-2xl text-slate-500 hover:text-red-500"
        >

          ✕

        </button>

        {/* TITLE */}

        <h1 className="text-3xl font-bold text-center mb-6 text-slate-800">

          {isRegister
            ? "Create Account"
            : "Login"}

        </h1>

        {/* NAME */}

        {isRegister && (

          <input
            type="text"
            placeholder="Enter Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name:
                  e.target.value,
              })
            }
            className="w-full border border-slate-300 p-3 rounded-xl mb-4 outline-none focus:border-indigo-500"
          />

        )}

        {/* EMAIL */}

        <input
          type="email"
          placeholder="Enter Email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email:
                e.target.value,
            })
          }
          className="w-full border border-slate-300 p-3 rounded-xl mb-4 outline-none focus:border-indigo-500"
        />

        {/* ROLE */}

        {isRegister && (

          <select
            value={form.role}
            onChange={(e) =>
              setForm({
                ...form,
                role:
                  e.target.value,
              })
            }
            className="w-full border border-slate-300 p-3 rounded-xl mb-4 outline-none focus:border-indigo-500"
          >

            <option value="student">
              Student
            </option>

            <option value="teacher">
              Teacher
            </option>

            <option value="admin">
              Admin
            </option>

          </select>

        )}

        {/* STANDARD */}

        {isRegister &&
          form.role ===
            "student" && (

            <select
              value={
                form.standard
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  standard:
                    e.target
                      .value,
                })
              }
              className="w-full border border-slate-300 p-3 rounded-xl mb-4 outline-none focus:border-indigo-500"
            >

              <option value="">
                Select Standard
              </option>

              <option value="6">
                Std 6
              </option>

              <option value="7">
                Std 7
              </option>

              <option value="8">
                Std 8
              </option>

            </select>

          )}

        {/* ================= REGISTER FLOW ================= */}

        {isRegister ? (

          <>

            {!otpSent ? (

              <button
                onClick={
                  register
                }
                disabled={
                  loading
                }
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition-all"
              >

                {loading
                  ? "Sending OTP..."
                  : "Send OTP"}

              </button>
              

            ) : (

              <>

                {/* OTP CARD */}

                {
                  showOtp && (

                    <div className="w-full bg-indigo-50 border border-indigo-200 rounded-xl p-3 mb-4 text-center">

                      <h2 className="text-3xl font-bold tracking-[10px] text-indigo-700">
                        {showOtp}
                      </h2>

                    </div>

                  )
                }

                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) =>
                    setOtp(
                      e.target
                        .value
                    )
                  }
                  className="w-full border border-slate-300 p-3 rounded-xl outline-none focus:border-green-500"
                />

                <button
                  onClick={
                    verifyOtp
                  }
                  disabled={
                    loading
                  }
                  className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl mt-4 transition-all"
                >

                  {loading
                    ? "Verifying..."
                    : "Verify OTP"}

                </button>

              </>

            )}

          </>

        ) : (

          <>

            {!loginOtpSent ? (

              <button
                onClick={
                  sendLoginOtp
                }
                disabled={
                  loading
                }
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition-all"
              >

                {loading
                  ? "Sending OTP..."
                  : "Send OTP"}

              </button>

            ) : (

              <>

                {/* OTP CARD */}

                {
                  showOtp && (

                    <div className="w-full bg-indigo-50 border border-indigo-200 rounded-xl p-3 mb-4 text-center">

                      <h2 className="text-3xl font-bold tracking-[10px] text-indigo-700">
                        {showOtp}
                      </h2>

                    </div>

                  )
                }

                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) =>
                    setOtp(
                      e.target
                        .value
                    )
                  }
                  className="w-full border border-slate-300 p-3 rounded-xl mb-4 outline-none focus:border-indigo-500"
                />

                <button
                  onClick={login}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl transition-all"
                >

                  {loading
                    ? "Logging In..."
                    : "Verify & Login"}

                </button>

              </>

            )}

          </>

        )}

        {/* TOGGLE */}

        <p
          className="text-center mt-6 text-indigo-600 cursor-pointer hover:underline"
          onClick={() => {

            setIsRegister(
              !isRegister
            );

            setOtp("");

            setShowOtp("");

            setOtpSent(false);

            setLoginOtpSent(false);

          }}
        >

          {isRegister
            ? "Already have an account?"
            : "Create account"}

        </p>

      </div>

    </div>
  );
};

export default LoginModal;