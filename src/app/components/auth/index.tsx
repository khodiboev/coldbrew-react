import React, { useState } from "react";
import { Fab, Modal, Fade, Stack, TextField } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { T } from "../../../lib/types/common";
import { Messages } from "../../../lib/config";
import MemberService from "../../services/MemberService";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";

// Ilgari @material-ui/core (eski v4) va @mui/material (v5+) aralashtirilib ishlatilgan edi -
// bu ikkalasi mos kelmaydigan alohida kutubxonalar. Endi faqat @mui/material ishlatiladi.
const modalSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const paperSx = {
  backgroundColor: "background.paper",
  borderRadius: "24px",
  boxShadow: "0 32px 80px rgba(26,20,16,0.35)",
  padding: 0,
  border: "none",
  outline: "none",
  overflow: "hidden",
};

// ── SVG Coffee Animation ──────────────────────────────────────
function CoffeeAnimation({ isTypingPassword }: { isTypingPassword: boolean }) {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: "linear-gradient(160deg, #1a1410 0%, #2c1f14 50%, #0f0b08 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background pattern */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle at 20% 80%, rgba(232,201,122,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(200,151,110,0.06) 0%, transparent 50%)",
      }} />

      {/* Coffee beans scattered */}
      {[
        { top: "10%", left: "15%", rot: "30deg", size: 18 },
        { top: "20%", left: "75%", rot: "-20deg", size: 14 },
        { top: "70%", left: "10%", rot: "60deg", size: 16 },
        { top: "80%", left: "80%", rot: "-45deg", size: 12 },
        { top: "55%", left: "85%", rot: "15deg", size: 10 },
        { top: "15%", left: "45%", rot: "-30deg", size: 11 },
      ].map((b, i) => (
        <div key={i} style={{
          position: "absolute", top: b.top, left: b.left,
          width: b.size, height: b.size * 1.4,
          background: "radial-gradient(ellipse at 35% 35%, #6b3a1f, #3d1e0a)",
          borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
          transform: `rotate(${b.rot})`,
          opacity: 0.6,
        }} />
      ))}

      {/* Cup */}
      <svg width="200" height="220" viewBox="0 0 200 220" style={{ position: "relative", zIndex: 2 }}>
        {/* Saucer */}
        <ellipse cx="100" cy="185" rx="70" ry="14" fill="#2c1f14" stroke="#e8c97a" strokeWidth="1.5" strokeOpacity="0.4" />

        {/* Cup body */}
        <path d="M 55 100 Q 52 150 65 170 Q 80 182 100 182 Q 120 182 135 170 Q 148 150 145 100 Z"
          fill="#1a1410" stroke="#e8c97a" strokeWidth="1.5" strokeOpacity="0.5" />

        {/* Cup top ellipse */}
        <ellipse cx="100" cy="100" rx="45" ry="12" fill="#2c1f14" stroke="#e8c97a" strokeWidth="1.5" strokeOpacity="0.5" />

        {/* Coffee surface */}
        <ellipse cx="100" cy="100" rx="40" ry="10" fill="#3d1e0a" />

        {/* Handle */}
        <path d="M 145 115 Q 168 115 168 135 Q 168 155 145 155"
          fill="none" stroke="#e8c97a" strokeWidth="3" strokeOpacity="0.6" strokeLinecap="round" />

        {/* Steam lines — hidden when typing password */}
        {!isTypingPassword && (
          <>
            <line x1="85" y1="90" x2="82" y2="55" stroke="#e8c97a" strokeWidth="2" strokeOpacity="0.5" strokeLinecap="round">
              <animate attributeName="opacity" values="0;0.6;0" dur="2s" repeatCount="indefinite" begin="0s" />
              <animate attributeName="y1" values="90;85;90" dur="2s" repeatCount="indefinite" />
              <animate attributeName="y2" values="55;45;55" dur="2s" repeatCount="indefinite" />
            </line>
            <line x1="100" y1="88" x2="100" y2="48" stroke="#e8c97a" strokeWidth="2" strokeOpacity="0.5" strokeLinecap="round">
              <animate attributeName="opacity" values="0;0.7;0" dur="2s" repeatCount="indefinite" begin="0.4s" />
              <animate attributeName="y1" values="88;83;88" dur="2s" repeatCount="indefinite" begin="0.4s" />
              <animate attributeName="y2" values="48;38;48" dur="2s" repeatCount="indefinite" begin="0.4s" />
            </line>
            <line x1="115" y1="90" x2="118" y2="55" stroke="#e8c97a" strokeWidth="2" strokeOpacity="0.5" strokeLinecap="round">
              <animate attributeName="opacity" values="0;0.5;0" dur="2s" repeatCount="indefinite" begin="0.8s" />
              <animate attributeName="y1" values="90;85;90" dur="2s" repeatCount="indefinite" begin="0.8s" />
              <animate attributeName="y2" values="55;45;55" dur="2s" repeatCount="indefinite" begin="0.8s" />
            </line>
          </>
        )}

        {/* Password mode — lid covers the cup */}
        {isTypingPassword && (
          <>
            <ellipse cx="100" cy="96" rx="48" ry="13"
              fill="#2c1f14" stroke="#e8c97a" strokeWidth="1.5" strokeOpacity="0.7" />
            <ellipse cx="100" cy="93" rx="20" ry="5" fill="#1a1410" />
            <rect x="88" y="86" width="24" height="8" rx="4"
              fill="#e8c97a" opacity="0.8" />
          </>
        )}
      </svg>

      {/* Label */}
      <div style={{
        marginTop: 16,
        fontFamily: "Poppins",
        fontSize: 13,
        fontWeight: 600,
        color: "rgba(232,201,122,0.7)",
        letterSpacing: "2px",
        textTransform: "uppercase",
      }}>
        {isTypingPassword ? "🔒 Secured" : "☕ ColdBrew"}
      </div>

      {/* Tagline */}
      <div style={{
        marginTop: 6,
        fontFamily: "Roboto Serif",
        fontSize: 12,
        fontStyle: "italic",
        color: "rgba(255,255,255,0.3)",
      }}>
        {isTypingPassword ? "Your data is safe with us" : "Death Before Decaf"}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function AuthenticationModal(props: AuthenticationModalProps) {
  const { signupOpen, loginOpen, handleSignupClose, handleLoginClose } = props;
  const [memberNick, setMemberNick] = useState<string>("");
  const [memberPhone, setMemberPhone] = useState<string>("");
  const [memberPassword, setMemberPassword] = useState<string>("");
  const [isTypingPassword, setIsTypingPassword] = useState(false);
  const { setAuthMember } = useGlobals();

  const handleUsername = (e: T) => setMemberNick(e.target.value);
  const handlePhone = (e: T) => setMemberPhone(e.target.value);
  const handlePassword = (e: T) => setMemberPassword(e.target.value);

  const handlePasswordFocus = () => setIsTypingPassword(true);
  const handlePasswordBlur = () => setIsTypingPassword(false);

  const handlePasswordKeyDown = (e: T) => {
    if (e.key === "Enter" && signupOpen) handleSignupRequest();
    else if (e.key === "Enter" && loginOpen) handleLoginRequest();
  };

  const handleSignupRequest = async () => {
    try {
      if (!memberNick || !memberPhone || !memberPassword) throw new Error(Messages.error3);
      const member = new MemberService();
      const result = await member.signup({ memberNick, memberPhone, memberPassword });
      setAuthMember(result);
      handleSignupClose();
    } catch (err) {
      handleSignupClose();
      sweetErrorHandling(err).then();
    }
  };

  const handleLoginRequest = async () => {
    try {
      if (!memberNick || !memberPassword) throw new Error(Messages.error3);
      const member = new MemberService();
      const result = await member.login({ memberNick, memberPassword });
      setAuthMember(result);
      handleLoginClose();
    } catch (err) {
      handleLoginClose();
      sweetErrorHandling(err).then();
    }
  };

  const inputSx = {
    width: "100%",
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      fontFamily: "Poppins",
      "& fieldset": { borderColor: "rgba(200,151,110,0.3)" },
      "&:hover fieldset": { borderColor: "#e8c97a" },
      "&.Mui-focused fieldset": { borderColor: "#e8c97a" },
    },
    "& .MuiInputLabel-root": { fontFamily: "Poppins", color: "#aaa" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#e8c97a" },
  };

  const formContent = (isSignup: boolean, onClose: () => void) => (
    <Stack direction="row" sx={{ width: isSignup ? "820px" : "740px", height: "460px" }}>
      {/* LEFT — Animation */}
      <div style={{ width: "45%", flexShrink: 0 }}>
        <CoffeeAnimation isTypingPassword={isTypingPassword} />
      </div>

      {/* RIGHT — Form */}
      <Stack sx={{
        flex: 1,
        padding: "40px 36px",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        background: "#ffffff",
      }}>
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <div style={{ fontFamily: "Poppins", fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#c8976e", marginBottom: 6 }}>
            {isSignup ? "Join us" : "Welcome back"}
          </div>
          <div style={{ fontFamily: "Roboto Serif", fontSize: 26, fontWeight: 700, color: "#1a1410" }}>
            {isSignup ? "Create Account" : "Sign In"}
          </div>
        </div>

        <TextField label="Username" variant="outlined" size="small" sx={inputSx} onChange={handleUsername} />
        {isSignup && (
          <TextField label="Phone number" variant="outlined" size="small" sx={inputSx} onChange={handlePhone} />
        )}
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          size="small"
          sx={inputSx}
          onChange={handlePassword}
          onFocus={handlePasswordFocus}
          onBlur={handlePasswordBlur}
          onKeyDown={handlePasswordKeyDown}
        />

        <Fab
          variant="extended"
          sx={{
            width: "100%",
            height: "48px",
            marginTop: "8px",
            background: "#1a1410 !important",
            color: "#e8c97a !important",
            fontFamily: "Poppins !important",
            fontWeight: "700 !important",
            fontSize: "14px !important",
            borderRadius: "12px !important",
            textTransform: "none !important",
            boxShadow: "0 4px 20px rgba(26,20,16,0.3) !important",
            "&:hover": {
              background: "#e8c97a !important",
              color: "#1a1410 !important",
            },
          }}
          onClick={isSignup ? handleSignupRequest : handleLoginRequest}
        >
          {isSignup ? <PersonAddIcon sx={{ mr: 1 }} /> : <LoginIcon sx={{ mr: 1 }} />}
          {isSignup ? "Create Account" : "Sign In"}
        </Fab>
      </Stack>
    </Stack>
  );

  return (
    <div>
      {/* SIGNUP */}
      <Modal
        open={signupOpen}
        onClose={handleSignupClose}
        closeAfterTransition
        slotProps={{ backdrop: { timeout: 500 } }}
        sx={modalSx}
      >
        <Fade in={signupOpen}>
          <Stack sx={paperSx}>
            {formContent(true, handleSignupClose)}
          </Stack>
        </Fade>
      </Modal>

      {/* LOGIN */}
      <Modal
        open={loginOpen}
        onClose={handleLoginClose}
        closeAfterTransition
        slotProps={{ backdrop: { timeout: 500 } }}
        sx={modalSx}
      >
        <Fade in={loginOpen}>
          <Stack sx={paperSx}>
            {formContent(false, handleLoginClose)}
          </Stack>
        </Fade>
      </Modal>
    </div>
  );
}

interface AuthenticationModalProps {
  signupOpen: boolean;
  loginOpen: boolean;
  handleSignupClose: () => void;
  handleLoginClose: () => void;
}