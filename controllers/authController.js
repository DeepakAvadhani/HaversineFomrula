const twilio = require("twilio");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_SERVICE_SID;
const client = twilio(accountSid, authToken);
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "8bedeff541b0dea42dabc9afb99eb9d9a595d1df5351ecdb817fdd1a866f44e03a0d626b2250b4a1e7d8cb7961d3cde26ad606f982d2a27e19e523d9433647008044afba9c0cc13be051314aeafdd69fbf2c0f8f054e1d674b88fab92f99a84d9d3debe15426b3a8fb99dce70a0c102af15922c19a2eadaf2ef647e8fa193c252d22d98315b91ef65405aa5986b4be778083ebe61cf8dff0ba4457b945aebd1f7d21be7dafa3fe6156db9b30e30a1c71b114a44b4bc8a1723de70244fbab5f663da08b2ca92741e962982409f07b97d47ad2cf6bbc07fd986b3539613a6481e40cb1e3188d6768a6e7c86bff1abb9440a8f1f515fa78f623d9c5813a79610935";

  const sendOTP = async (phoneNumber) => {
    try {
      const verification = await client.verify.v2
        .services(verifyServiceSid)
        .verifications.create({ to: phoneNumber, channel: "sms" });
      return verification;
    } catch (err) {
      console.log('Error details:', err);
      throw err;
    }
  };

const verifyOTP = async (phoneNumber, code) => {
  try {
    const verificationCheck = await client.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({ to: phoneNumber, code });
    return verificationCheck;
  } catch (error) {
    throw error;
  }
};

exports.sendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const verification = await sendOTP(phoneNumber);

    res.status(200).send({ success: true, status: verification.status });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Failed to send OTP", error });
  }
};

exports.VerifyOtp = async (req, res) => {
  const { phoneNumber, code } = req.body;

  try {
    const verificationCheck = await verifyOTP(phoneNumber, code);
    if (verificationCheck.status !== "approved") {
      return res.status(400).send({ success: false, message: "Invalid OTP" });
    }
    let user = await User.findOne({
      where: { phone_number: phoneNumber },
      attributes: [
        "id",
        "name",
        "phone_number",
        "email",
        "pincode",
        "status",
        "meta",
        "role",
      ],
    });

    if (!user) {
      user = await User.create({
        name: "NULL",
        phone_number: phoneNumber,
        status: "active",
        role: "delivery",
        meta: { login_count: 1 },
      });
    } else {
      if (!user.status || user.status === "inactive") {
        try {
          await user.update({ status: "active" });
          console.log(`User ${user.id} reactivated.`);
        } catch (error) {
          console.error("Failed to update user status:", error);
        }
      }

      user.meta = {
        ...user.meta,
        login_count: user.meta.login_count ? user.meta.login_count + 1 : 1,
      };
      await user.save();
    }
    const token = jwt.sign({ phoneNumber }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).send({
      success: true,
      message: "OTP verified successfully",
      token: `Bearer ${token}`,
      user: {
        id: user.id,
        name: user.name,
        phone_number: user.phone_number,
        email: user.email,
        pincode: user.pincode,
        login_count: user.meta.login_count,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Verification failed:", error);
    res
      .status(500)
      .send({ success: false, message: "Failed to verify OTP", error });
  }
};
