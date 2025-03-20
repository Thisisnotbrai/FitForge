import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./VerificationTab.css";

const VerificationTab = () => {
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Get email from location state, fallback to empty string if not provided
  const email = location.state?.email || "";

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);

    // If no email was provided, redirect back to signup
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  const handleChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    // Update the verification code state
    const newVerificationCode = [...verificationCode];
    newVerificationCode[index] = value;
    setVerificationCode(newVerificationCode);

    // If a digit was entered and there's a next input, focus on it
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (verificationCode[index] === "" && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
    // Handle left arrow
    else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    // Handle right arrow
    else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    // If pasted content is 6 digits, fill all inputs
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setVerificationCode(digits);

      // Focus the last input
      inputRefs.current[5].focus();
    }
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setError("");

    // Check if all digits are entered
    if (verificationCode.join("").length !== 6) {
      setError("Please enter all 6 digits");
      setIsVerifying(false);
      return;
    }

    // Here you would typically verify the code with your backend
    // For demo purposes, let's simulate a verification
    setTimeout(() => {
      setIsVerifying(false);
      // Example verification logic (replace with actual API call)
      if (verificationCode.join("") === "123456") {
        // Verification successful, redirect or show success message
        alert("Verification successful!");
        // Redirect to appropriate dashboard based on user role
        // You would typically get the role from your backend or session
        navigate("/Dashboard");
      } else {
        setError("Invalid verification code. Please try again.");
      }
    }, 1500);
  };

  const handleResendCode = () => {
    // Simulate resending code
    alert(`A new verification code has been sent to ${email}`);
  };

  return (
    <div className="verification-container">
      <div className="verification-card">
        <h1>Email Verification</h1>
        <p>We have sent a verification code to:</p>
        <p className="verification-email">{email}</p>
        <p>Enter the 6-digit code below to verify your account.</p>

        <div className="verification-inputs">
          {verificationCode.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : null}
              ref={(el) => (inputRefs.current[index] = el)}
              className="verification-input"
              autoFocus={index === 0}
            />
          ))}
        </div>

        {error && <p className="verification-error">{error}</p>}

        <button
          className="verification-button"
          onClick={handleVerify}
          disabled={isVerifying}
        >
          {isVerifying ? "Verifying..." : "Verify"}
        </button>

        <p className="verification-resend">
          Did not receive the code?{" "}
          <button className="resend-button" onClick={handleResendCode}>
            Resend Code
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerificationTab;
