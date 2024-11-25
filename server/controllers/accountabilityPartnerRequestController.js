import AccountabilityPartnerRequest from "../models/AccountabilityPartnerRequest.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

export const handleStatusUpdate = asyncHandler(async (req, res) => {
  const { accepterId } = req.params;
  const { accepteeId } = req.body;
  const { status } = req.query;

  if (status !== "Accepted" && status !== "Rejected") {
    throw ApiError.BadRequest("You can only Reject and Accept a request.");
  }

  if (accepterId === accepteeId) {
    throw ApiError.BadRequest("Cannot accept your own request.");
  }

  const acceptee = await User.findById(accepteeId).select(
    "accountabilityPartner"
  );

  if (!acceptee) {
    throw new ApiError.NotFound("Acceptee not found.");
  }

  const accepter = await User.findById(accepterId).select(
    "accountabilityPartner"
  );

  if (!accepter) {
    throw ApiError.NotFound("Accepter not found.");
  }

  const accountabilityPartnerRequestObject =
    await AccountabilityPartnerRequest.findOne({
      receiver: accepteeId,
      sender: accepterId,
      status: { $in: ["Pending", "Rejected"] },
    });

  if (!accountabilityPartnerRequestObject) {
    throw ApiError.NotFound("No pending request was found.");
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

  return ApiResponse.Ok(`${status} partner request successfully.`, {
    partnerRequest: accountabilityPartnerRequestObject,
    ...(status === "Accepted" ? { accepter, acceptee } : {}),
  }).send(res);
});
