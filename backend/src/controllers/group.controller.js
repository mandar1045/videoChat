import Group from "../models/group.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const createGroup = async (req, res) => {
  try {
    const { name, members, profilePic } = req.body;
    const creator = req.user._id;

    const allMembers = [...new Set([...members, creator])];

    let profilePicUrl = "";
    if (profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      profilePicUrl = uploadResponse.secure_url;
    }

    const group = new Group({
      name,
      creator,
      members: allMembers,
      profilePic: profilePicUrl,
    });

    await group.save();

    await group.populate("members", "fullName profilePic");

    res.status(201).json(group);
  } catch (error) {
    console.error("Error in createGroup: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getGroups = async (req, res) => {
  try {
    const userId = req.user._id;
    const groups = await Group.find({ members: userId }).populate("members", "fullName profilePic");

    res.status(200).json(groups);
  } catch (error) {
    console.error("Error in getGroups: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addMember = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const { userId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    if (!group.members.includes(req.user._id)) return res.status(403).json({ error: "Not a member" });

    if (group.members.includes(userId)) return res.status(400).json({ error: "Already a member" });

    group.members.push(userId);
    await group.save();

    await group.populate("members", "fullName profilePic");

    res.status(200).json(group);
  } catch (error) {
    console.error("Error in addMember: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const leaveGroup = async (req, res) => {
  try {
    const { id: groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    if (!group.members.includes(req.user._id)) return res.status(403).json({ error: "Not a member" });

    group.members = group.members.filter((id) => id.toString() !== req.user._id.toString());

    if (group.members.length === 0) {
      await Group.findByIdAndDelete(groupId);
      return res.status(200).json({ message: "Group deleted" });
    }

    await group.save();

    res.status(200).json(group);
  } catch (error) {
    console.error("Error in leaveGroup: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const { id: groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    if (group.creator.toString() !== req.user._id.toString()) return res.status(403).json({ error: "Only creator can delete group" });

    await Group.findByIdAndDelete(groupId);

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error("Error in deleteGroup: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateGroupProfilePic = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const { profilePic } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    if (group.creator.toString() !== req.user._id.toString()) return res.status(403).json({ error: "Only creator can update group profile pic" });

    if (!profilePic) {
      return res.status(400).json({ error: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    ).populate("members", "fullName profilePic");

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error("Error in updateGroupProfilePic: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};