const User = require('../models/user');
const { removeFile } = require('../helpers/utils');
exports.profile = async (req, res) => {
    try {
        res.status(200).send({
            success: true,
            data: req.data
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

exports.updateProfile = async (req, res) => {
    try {
        if (req.fileValidationError) {
            throw new Error(req.fileValidationError);
        }
        const user = await User.findOne({ _id: req.data._id }).lean();
        const profile = { ...user.profile, ...req.body };

        if (req.files["image"]) {
            if (profile.picture) {
                removeFile(profile.picture); // we can move file to "Trash" as well.
            }
            profile.picture = req.files["image"][0].path;
        }

        await User.findOne({ _id: req.data._id }, (err, u) => {
            if (err) {
                throw new Error(err.message);
            } else {
                u.profile = profile;
                u.save();
                res.status(200).send({
                    success: true,
                    message: 'Profile updated successfully.'
                });
            }
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

exports.list = async (req, res) => {
    try {
        let searchOptions = {
        };

        const paginationOptions = {
            skip: 0,
            limit: 10,
            sortBy: { updatedAt: -1 }
        };

        if (req.body.filter) {
            searchOptions = { ...searchOptions, ...req.body.filter };
        }

        if (req.body.search) {
            const searchParams = req.body.search;
            Object.keys(searchParams).map(function (key) {
                return (searchParams[key] = new RegExp(searchParams[key].trim(), "i"));
            });
            searchOptions = { ...searchOptions, ...searchParams };
        }

        if (req.body.start) {
            paginationOptions.skip = req.body.start;
        }
        if (req.body.pageSize) {
            paginationOptions.limit = req.body.pageSize;
        }
        if (req.body.sortBy) {
            paginationOptions.sortBy = req.body.sortBy;
        }

        var data = await User.find(searchOptions)
            .skip(paginationOptions.skip)
            .limit(paginationOptions.limit)
            .sort(paginationOptions.sortBy)
            .lean();
        var countDoc = await User.countDocuments(searchOptions);

        res.status(200).json({
            success: true,
            data: {
                data,
                totalRecords: countDoc,
                start: paginationOptions.skip,
                pageSize: paginationOptions.limit
            },
            message: "Users List Fetched Successfully"
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}