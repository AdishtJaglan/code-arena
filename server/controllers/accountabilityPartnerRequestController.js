import AccountabilityPartnerRequest from "../models/AccountabilityPartnerRequest.js";
import User from "../models/User.js";

export const handleStatusUpdate = async (req, res) => {
  try {
    const { accepterId } = req.params;
    const { accepteeId } = req.body;
    const { status } = req.query;

    if (status !== "Accepted" && status !== "Rejected") {
      return res
        .status(400)
        .json({ message: "You can only Reject and Accept a request." });
    }

    if (accepterId === accepteeId) {
      return res
        .status(400)
        .json({ message: "Cannot accept your own request." });
    }

    const acceptee = await User.findById(accepteeId).select(
      "accountabilityPartner"
    );

    if (!acceptee) {
      return res.status(404).json({ message: "Acceptee not found." });
    }

    const accepter = await User.findById(accepterId).select(
      "accountabilityPartner"
    );

    if (!accepter) {
      return res.status(404).json({ message: "Accepter not found." });
    }

    const accountabilityPartnerRequestObject =
      await AccountabilityPartnerRequest.findOne({
        receiver: accepteeId,
        sender: accepterId,
        status: { $in: ["Pending", "Rejected"] },
      });

    if (!accountabilityPartnerRequestObject) {
      return res.status(404).json({ message: "No pending request was found." });
    }

    accountabilityPartnerRequestObject.status = status;

    if (status === "Accepted") {
      accepter.accountabilityPartner = acceptee._id;
      acceptee.accountabilityPartner = accepter._id;
    }

    await Promise.all([
      accountabilityPartnerRequestObject.save(),
      ...(status === "Accepted" ? [accepter.save(), acceptee.save()] : []),
    ]);

    return res.status(200).json({
      message: `${status} partner request successfully.`,
      partnerRequest: accountabilityPartnerRequestObject,
      ...(status === "Accepted" ? { accepter, acceptee } : {}),
    });
  } catch (error) {
    return res.status(500).json({ message: "Error processing request", error });
  }
};
