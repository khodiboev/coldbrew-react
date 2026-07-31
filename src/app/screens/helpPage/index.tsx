import React from "react";
import { Box, Container, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Tab from "@mui/material/Tab";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import Tabs from "@mui/material/Tabs";
import SendIcon from "@mui/icons-material/Send";
import GavelIcon from "@mui/icons-material/Gavel";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import EmailIcon from "@mui/icons-material/Email";
import "../../../css/help.css";
import { faq } from "../../../lib/data/faq";
import { terms } from "../../../lib/data/terms";
import { sweetTopSuccessAlert } from "../../../lib/sweetAlert";
import { Messages } from "../../../lib/config";
import Swal from "sweetalert2";

export default function HelpPage() {
  const [value, setValue] = React.useState("1");
  const [contactForm, setContactForm] = React.useState({
    memberNick: "",
    memberEmail: "",
    memberMsg: "",
  });

  const handleChange = (e: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { memberNick, memberEmail, memberMsg } = contactForm;
    if (!memberNick || !memberEmail || !memberMsg) {
      await Swal.fire({ icon: "warning", text: Messages.error3, showConfirmButton: false, timer: 2000 });
      return;
    }
    // Hozircha alohida "contact" backend endpoint mavjud emas —
    // shuning uchun faqat foydalanuvchiga muvaffaqiyatli yuborilgani ko'rsatiladi.
    await sweetTopSuccessAlert("Message sent! We'll get back to you soon.", 2000);
    setContactForm({ memberNick: "", memberEmail: "", memberMsg: "" });
  };

  return (
    <div className="help-page">
      <Container className="help-container">

        {/* Header */}
        <Stack className="help-header">
          <Box className="help-label">☕ Support Center</Box>
          <Box className="help-title">How Can We Help?</Box>
          <Box className="help-subtitle">
            Find answers, read our terms, or drop us a message
          </Box>
        </Stack>

        <TabContext value={value}>
          {/* Tabs */}
          <Box className="help-menu">
            <Tabs
              value={value}
              onChange={handleChange}
              className="help-tabs"
            >
              <Tab
                label={
                  <Stack flexDirection="row" alignItems="center" gap={1}>
                    <GavelIcon sx={{ fontSize: 16 }} />
                    <span>Terms</span>
                  </Stack>
                }
                value="1"
              />
              <Tab
                label={
                  <Stack flexDirection="row" alignItems="center" gap={1}>
                    <HelpOutlineIcon sx={{ fontSize: 16 }} />
                    <span>FAQ</span>
                  </Stack>
                }
                value="2"
              />
              <Tab
                label={
                  <Stack flexDirection="row" alignItems="center" gap={1}>
                    <EmailIcon sx={{ fontSize: 16 }} />
                    <span>Contact</span>
                  </Stack>
                }
                value="3"
              />
            </Tabs>
          </Box>

          <Stack className="help-main-content">

            {/* TERMS */}
            <TabPanel value="1">
              <Box className="help-tab-panel">
                <Stack className="rules-box">
                  {terms.map((term, i) => (
                    <Stack key={i} className="term-item">
                      <Box className="term-number">{String(i + 1).padStart(2, "0")}</Box>
                      <Box className="term-text">{term}</Box>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </TabPanel>

            {/* FAQ */}
            <TabPanel value="2">
              <Box className="help-tab-panel">
                <Stack className="accordion-menu">
                  {faq.map((item, i) => (
                    <Accordion key={i} className="faq-accordion">
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: "#e8c97a" }} />}
                        className="faq-summary"
                      >
                        <Stack flexDirection="row" alignItems="center" gap={2}>
                          <Box className="faq-num">Q{i + 1}</Box>
                          <Typography className="faq-question">{item.question}</Typography>
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails className="faq-details">
                        <Typography className="faq-answer">{item.answer}</Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Stack>
              </Box>
            </TabPanel>

            {/* CONTACT */}
            <TabPanel value="3">
              <Box className="help-tab-panel">
                <Stack className="contact-layout">

                  {/* Left — info */}
                  <Stack className="contact-info">
                    <Box className="contact-info-title">Get in Touch</Box>
                    <Box className="contact-info-desc">
                      Have a question or feedback? We'd love to hear from you. Fill out the form and we'll get back to you within 24 hours.
                    </Box>
                    <Stack className="contact-info-items">
                      <Stack className="contact-info-item">
                        <Box className="contact-info-icon">📍</Box>
                        <Box className="contact-info-text">Gangnam-gu, Seoul, South Korea</Box>
                      </Stack>
                      <Stack className="contact-info-item">
                        <Box className="contact-info-icon">📞</Box>
                        <Box className="contact-info-text">+82 10 1234 5678</Box>
                      </Stack>
                      <Stack className="contact-info-item">
                        <Box className="contact-info-icon">✉️</Box>
                        <Box className="contact-info-text">hello@coldbrew.kr</Box>
                      </Stack>
                      <Stack className="contact-info-item">
                        <Box className="contact-info-icon">🕐</Box>
                        <Box className="contact-info-text">Mon–Sun · 7AM – 11PM</Box>
                      </Stack>
                    </Stack>
                  </Stack>

                  {/* Right — form */}
                  <Stack className="contact-form-box">
                    <form className="contact-form" onSubmit={handleContactSubmit}>
                      <Stack className="form-group">
                        <label>Your Name</label>
                        <input
                          type="text"
                          name="memberNick"
                          placeholder="John Doe"
                          value={contactForm.memberNick}
                          onChange={handleContactChange}
                        />
                      </Stack>
                      <Stack className="form-group">
                        <label>Your Email</label>
                        <input
                          type="email"
                          name="memberEmail"
                          placeholder="john@example.com"
                          value={contactForm.memberEmail}
                          onChange={handleContactChange}
                        />
                      </Stack>
                      <Stack className="form-group">
                        <label>Message</label>
                        <textarea
                          name="memberMsg"
                          placeholder="Tell us how we can help..."
                          rows={5}
                          value={contactForm.memberMsg}
                          onChange={handleContactChange}
                        />
                      </Stack>
                      <Button
                        type="submit"
                        variant="contained"
                        className="contact-submit-btn"
                        endIcon={<SendIcon />}
                      >
                        Send Message
                      </Button>
                    </form>
                  </Stack>

                </Stack>
              </Box>
            </TabPanel>
          </Stack>
        </TabContext>
      </Container>
    </div>
  );
}