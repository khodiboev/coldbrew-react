import { Box, Container, Stack } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Settings } from "./Settings";
import { useHistory } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import "../../../css/userPage.css";
import { serverApi } from "../../../lib/config";
import { MemberType } from "../../../lib/enums/member.enum";

export default function UserPage() {
  const history = useHistory();
  const { authMember } = useGlobals();

  if (!authMember) { history.push("/"); return null; }

  return (
    <div className="user-page">
      <Container>
        <Stack className="my-page-frame">

          {/* LEFT — Form */}
          <Stack className="my-page-left">
            <Box className="menu-name">My Profile</Box>
            <Box className="menu-content">
              <Settings />
            </Box>
          </Stack>

          {/* RIGHT — Preview card */}
          <Stack className="my-page-right">
            <Box className="order-info-box">
              {/* Avatar */}
              <div className="order-user-img">
                <img
                  src={authMember?.memberImage ? `${serverApi}/${authMember.memberImage}` : "/icons/default-user.svg"}
                  className="order-user-avatar"
                  alt=""
                />
                <div className="order-user-icon-box">
                  <img
                    src={authMember?.memberType === MemberType.RESTAURANT ? "/icons/restaurant.svg" : "/icons/user-badge.svg"}
                    alt=""
                  />
                </div>
              </div>

              {/* Info */}
              <span className="order-user-name">{authMember?.memberNick}</span>
              <span className="order-user-prof">{authMember?.memberType}</span>
              <span className="order-user-address">
                {authMember?.memberAddress ?? "No address"}
              </span>

              <Box className="profile-divider" />

              {/* Social */}
              <Box className="user-media-box">
                <FacebookIcon />
                <InstagramIcon />
                <TelegramIcon />
                <YouTubeIcon />
              </Box>

              <Box className="profile-divider" />

              {/* Description */}
              <p className="user-desc">
                {authMember?.memberDesc ?? "No description yet"}
              </p>
            </Box>
          </Stack>

        </Stack>
      </Container>
    </div>
  );
}