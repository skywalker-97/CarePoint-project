/**
 * Centralized utility for profile image handling across CarePoint.
 * Supports seeded asset keys, real URLs, data URLs, and safe fallbacks.
 */

import { doctors as seededDoctors } from '../assets/assets_frontend/assets';

const FALLBACK_DOCTOR = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
const FALLBACK_PATIENT = "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png";

const ABSOLUTE_IMAGE_PREFIXES = ['http://', 'https://', 'data:image/', 'blob:'];

export const doctorImageAssetMap = seededDoctors.reduce((acc, doctor) => {
    if (doctor?._id && doctor?.image) {
        acc[doctor._id] = doctor.image;
    }
    return acc;
}, {});

const doctorImageNameMap = seededDoctors.reduce((acc, doctor) => {
    if (!doctor?.name || !doctor?.image) return acc;

    const rawName = doctor.name.trim().toLowerCase();
    const normalizedName = rawName.startsWith('dr.') ? rawName.slice(3).trim() : rawName.replace(/^dr\s+/, '').trim();

    acc[rawName] = doctor.image;
    acc[normalizedName] = doctor.image;
    return acc;
}, {});

const isDirectImageSource = (value) => {
    if (typeof value !== 'string') return false;
    const trimmed = value.trim();
    if (!trimmed) return false;

    return ABSOLUTE_IMAGE_PREFIXES.some((prefix) => trimmed.startsWith(prefix)) || trimmed.startsWith('/');
};

const getFallbackImage = (type) => type === 'doctor' ? FALLBACK_DOCTOR : FALLBACK_PATIENT;

/**
 * Returns the best available image URL for a doctor or user.
 * Priority: direct URL/data URL -> seeded asset key in image field -> asset map by _id -> fallback
 */
export const getProfileImage = (entity, type = 'doctor', assetMap = {}) => {
    if (!entity) return getFallbackImage(type);

    const rawImage = typeof entity.image === 'string' ? entity.image.trim() : '';

    if (isDirectImageSource(rawImage)) {
        return rawImage;
    }

    if (type === 'doctor' && rawImage && assetMap[rawImage]) {
        return assetMap[rawImage];
    }

    if (entity._id && assetMap[entity._id]) {
        return assetMap[entity._id];
    }

    if (type === 'doctor' && typeof entity.name === 'string') {
        const rawName = entity.name.trim().toLowerCase();
        const normalizedName = rawName.startsWith('dr.') ? rawName.slice(3).trim() : rawName.replace(/^dr\s+/, '').trim();

        if (doctorImageNameMap[rawName]) {
            return doctorImageNameMap[rawName];
        }

        if (doctorImageNameMap[normalizedName]) {
            return doctorImageNameMap[normalizedName];
        }
    }

    return getFallbackImage(type);
};

export const getDoctorImage = (doctor, assetMap = doctorImageAssetMap) => getProfileImage(doctor, 'doctor', assetMap);
export const getUserImage = (user) => getProfileImage(user, 'user');

export const enhanceDoctorsWithImages = (doctorsList = [], assetMap = doctorImageAssetMap) => {
    return doctorsList.map((doctor) => {
        const image = getDoctorImage(doctor, assetMap);
        return { ...doctor, image, fallbackImage: image };
    });
};
