import AccountabilityPartnerRequest from "../models/AccountabilityPartnerRequest.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

export const sendAccountabilityPartnerRequest = asyncHandler(
  async (req, res) => {
    const { _id: senderId } = req?.user;
    const { receiverId } = req.body;

    if (!receiverId) {
      throw ApiError.BadRequest("Receiver ID mandatory.");
    }

    if (!senderId) {
      throw ApiError.BadRequest("Sender ID mandatory.");
    }

    const sender = await User.findById(senderId).select(
      "accountabilityPartnerRequest"
    );
    if (!sender) {
      throw ApiError.NotFound("Sender does not exist.");
    }

    const receiver = await User.findById(receiverId).select(
      "accountabilityPartnerRequest"
    );
    if (!receiver) {
      throw ApiError.NotFound("Receiver does not exist.");
    }

    const existingRequest = await AccountabilityPartnerRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      status: "Pending",
    });

    if (existingRequest) {
      throw ApiError.BadRequest("A pending request already exists.");
    }

    const accountabilityPartnerRequestObject =
      await AccountabilityPartnerRequest.create({
        sender: senderId,
        receiver: receiverId,
      });

    sender.accountabilityPartnerRequest.push(
      accountabilityPartnerRequestObject._id
    );
    receiver.accountabilityPartnerRequest.push(
      accountabilityPartnerRequestObject._id
    );

    await Promise.all([sender.save(), receiver.save()]);

    return ApiResponse.Ok("Request sent successfully.", {
      sender,
      receiver,
      sentRequest: accountabilityPartnerRequestObject,
    }).send(res);
  }
);

export const handleStatusUpdate = asyncHandler(async (req, res) => {
  const { _id: accepterId } = req?.user;
  const { senderId, status } = req.body;

  if (status !== "Accepted" && status !== "Rejected") {
    throw ApiError.BadRequest("You can only Reject and Accept a request.");
  }

  if (accepterId === senderId) {
    throw ApiError.BadRequest("Cannot accept your own request.");
  }

  const sender = await User.findById(senderId).select("accountabilityPartner");

  if (!sender) {
    throw ApiError.NotFound("Sender not found.");
  }

  const accepter = await User.findById(accepterId).select(
    "accountabilityPartner"
  );

  if (!accepter) {
    throw ApiError.NotFound("Accepter not found.");
  }

  const accountabilityPartnerRequestObject =
    await AccountabilityPartnerRequest.findOne({
      receiver: accepterId,
      sender: sender,
      status: "Pending",
    });

  if (!accountabilityPartnerRequestObject) {
    throw ApiError.NotFound("No pending request was found.");
  }

  accountabilityPartnerRequestObject.status = status;

  if (status === "Accepted") {
    accepter.accountabilityPartner = sender._id;
    sender.accountabilityPartner = accepter._id;
  }

  await Promise.all([
    accountabilityPartnerRequestObject.save(),
    ...(status === "Accepted" ? [accepter.save(), sender.save()] : []),
  ]);

  return ApiResponse.Ok(`${status} partner request successfully.`, {
    partnerRequest: accountabilityPartnerRequestObject,
    ...(status === "Accepted" ? { accepter, sender } : {}),
  }).send(res);
});

export const getPartnerRequests = asyncHandler(async (req, res) => {
  const { _id: id } = req.user;

  if (!id) {
    throw ApiError.Unauthorized("Unauthorized");
  }

  const userCheck = await User.exists({ _id: id });

  if (!userCheck) {
    throw ApiError.NotFound("User not found.");
  }

  const requests = await AccountabilityPartnerRequest.find({
    receiver: id,
    status: "Pending",
  })
    .populate({
      path: "sender",
      select: "username profilePicture rating",
    })
    .select("sender -_id")
    .lean();

  const flattenedRequests = requests.map((request) => ({
    ...request.sender,
  }));

  return ApiResponse.Ok("Fetched requests.", {
    count: requests.length,
    requests: flattenedRequests,
  }).send(res);
});
