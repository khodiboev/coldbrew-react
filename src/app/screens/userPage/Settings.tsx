import { Box } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Button from "@mui/material/Button";
import { useGlobals } from "../../hooks/useGlobals";
import { useState } from "react";
import { MemberUpdateInput } from "../../../lib/types/member";
import { T } from "../../../lib/types/common";
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from "../../../lib/sweetAlert";
import { Messages, serverApi } from "../../../lib/config";
import MemberService from "../../services/MemberService";

export function Settings() {
  const { authMember, setAuthMember } = useGlobals();

  const [memberImage, setMemberImage] = useState<string>(
    authMember?.memberImage
      ? `${serverApi}/${authMember.memberImage}`
      : "/icons/default-user.svg"
  );

  // yangi rasm tanlanganda true bo'ladi
  const [imageChanged, setImageChanged] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [memberUpdateInput, setMemberUpdateInput] = useState<MemberUpdateInput>({
    memberNick: authMember?.memberNick,
    memberPhone: authMember?.memberPhone,
    memberAddress: authMember?.memberAddress,
    memberDesc: authMember?.memberDesc,
  });

  const memberNickHandler = (e: T) =>
    setMemberUpdateInput((prev) => ({ ...prev, memberNick: e.target.value }));

  const memberPhoneHandler = (e: T) =>
    setMemberUpdateInput((prev) => ({ ...prev, memberPhone: e.target.value }));

  const memberAddressHandler = (e: T) =>
    setMemberUpdateInput((prev) => ({ ...prev, memberAddress: e.target.value }));

  const memberDescriptionHandler = (e: T) =>
    setMemberUpdateInput((prev) => ({ ...prev, memberDesc: e.target.value }));

  const handleImageViewer = (e: T) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      sweetErrorHandling(Messages.error5).then();
      return;
    }

    setMemberUpdateInput((prev) => ({ ...prev, memberImage: file }));
    setMemberImage(URL.createObjectURL(file));
    setImageChanged(true);
  };

  const handleSubmitHandler = async () => {
    if (submitting) return;
    try {
      setSubmitting(true);
      if (!authMember) throw new Error(Messages.error2);
      if (!memberUpdateInput.memberNick || !memberUpdateInput.memberPhone)
        throw new Error(Messages.error3);

      // rasm tanlanmagan bo'lsa memberImage yuborilmaydi
      const submitData: MemberUpdateInput = { ...memberUpdateInput };
      if (!imageChanged) {
        delete submitData.memberImage;
      }

      const member = new MemberService();
      const result = await member.updateMember(submitData);
      setAuthMember(result);
      await sweetTopSmallSuccessAlert("Profile updated!", 1500);
    } catch (err) {
      sweetErrorHandling(err).then();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className="settings">

      {/* Avatar upload */}
      <Box className="member-media-frame">
        <img src={memberImage} className="mb-image" alt="" />
        <div className="media-change-box">
          <span>Profile Photo</span>
          <p>JPG, JPEG, PNG only</p>
          <div className="up-del-box">
            <Button component="label" onChange={handleImageViewer} sx={{ minWidth: "auto", p: 0 }}>
              <CloudDownloadIcon />
              <input type="file" hidden />
            </Button>
          </div>
        </div>
      </Box>

      {/* Username */}
      <Box className="input-frame">
        <div className="long-input">
          <label className="spec-label">Username</label>
          <input
            className="spec-input"
            type="text"
            placeholder="Your username"
            value={memberUpdateInput.memberNick ?? ""}
            onChange={memberNickHandler}
          />
        </div>
      </Box>

      {/* Phone + Address */}
      <Box className="input-frame">
        <div className="short-input">
          <label className="spec-label">Phone</label>
          <input
            className="spec-input"
            type="text"
            placeholder="Phone number"
            value={memberUpdateInput.memberPhone ?? ""}
            onChange={memberPhoneHandler}
          />
        </div>
        <div className="short-input">
          <label className="spec-label">Address</label>
          <input
            className="spec-input"
            type="text"
            placeholder="Your address"
            value={memberUpdateInput.memberAddress ?? ""}
            onChange={memberAddressHandler}
          />
        </div>
      </Box>

      {/* Description */}
      <Box className="input-frame">
        <div className="long-input">
          <label className="spec-label">About Me</label>
          <textarea
            className="spec-textarea"
            placeholder="Tell us a little about yourself..."
            value={memberUpdateInput.memberDesc ?? ""}
            onChange={memberDescriptionHandler}
          />
        </div>
      </Box>

      {/* Save */}
      <Box className="save-box">
        <Button variant="contained" onClick={handleSubmitHandler} disabled={submitting}>
          {submitting ? "Saving..." : "Save Changes"}
        </Button>
      </Box>

    </Box>
  );
}