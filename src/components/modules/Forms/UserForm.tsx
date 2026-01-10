"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { User, Role, UserStatus, ILocation } from "@/types";
import SingleImageUploader from "@/components/SingleImageUploder";
import Image from "next/image";
const MapSelector = dynamic(() => import("@/components/ui/MapSelector"), {
  ssr: false,
});

type UserFormProps = {
  user: User | null;
  onSubmit: (data: FormData) => Promise<void>;
};

export default function UserForm({ user, onSubmit }: UserFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    bio: "",
    interests: "",
    role: "USER" as Role,
    status: "ACTIVE" as UserStatus,
    isVerified: false,
  });

  const [location, setLocation] = useState<ILocation>({
    lat: 24.8949,
    lng: 91.8687,
    formattedAddress: "Sylhet, Bangladesh",
  });

  useEffect(() => {
    if (!user) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      fullName: user.fullName ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      password: "",
      bio: user.bio ?? "",
      interests: Array.isArray(user.interests) ? user.interests.join(", ") : "",
      role: user.role ?? "USER",
      status: user.status ?? "ACTIVE",
      isVerified: user.isVerified ?? false,
    });

    setLocation(
      user.city ?? {
        lat: 24.8949,
        lng: 91.8687,
        formattedAddress: "Sylhet, Bangladesh",
      }
    );

    setImagePreview(user.picture ?? "");
  }, [user]);

  // ---------- Handlers ----------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleManualLatLngChange = (latStr: string, lngStr: string) => {
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    if (!isNaN(lat) && !isNaN(lng)) {
      setLocation((prev) => ({ ...prev, lat, lng }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("fullName", form.fullName);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    if (form.password) formData.append("password", form.password);
    formData.append("bio", form.bio);
    formData.append(
      "interests",
      form.interests.split(",").map((i) => i.trim()).join(",")
    );
    formData.append("role", form.role);
    formData.append("status", form.status);
    formData.append("isVerified", String(form.isVerified));
    formData.append("city", JSON.stringify(location));

    if (imageFile) {
      formData.append("picture", imageFile);
    }

    await onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-8/12 mx-auto p-6 border dark:border-slate-700/70 rounded-lg shadow-md space-y-4"
    >
      <div>
        <label className="block text-sm font-medium">Full Name</label>
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Phone</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Password</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder="Leave blank to keep current password"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Bio</label>
        <input
          name="bio"
          value={form.bio}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Interests</label>
        <input
          name="interests"
          value={form.interests}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder="Comma separated interests"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Profile Picture</label>
        {imagePreview && (
          <Image
            width={100}
            height={100}
            src={imagePreview}
            alt="Profile Preview"
            className="w-24 h-24 rounded-full object-cover mb-2 border"
          />
        )}
        <SingleImageUploader
          onChange={(file) => {
            if (file instanceof File) {
              setImageFile(file);
              setImagePreview(URL.createObjectURL(file));
            }
          }}
        />
      </div>

      <div>
        <p className="text-xs mb-2">
          Tip: Select location (lat, lng) using the map and add formatted address manually!
        </p>

        <div className="grid grid-cols-2 gap-3 mb-2">
          <input
            type="number"
            value={location.lat}
            onChange={(e) =>
              handleManualLatLngChange(e.target.value, String(location.lng))
            }
            className="border rounded px-3 py-2"
            placeholder="Latitude"
          />
          <input
            type="number"
            value={location.lng}
            onChange={(e) =>
              handleManualLatLngChange(String(location.lat), e.target.value)
            }
            className="border rounded px-3 py-2"
            placeholder="Longitude"
          />
        </div>

        <input
          value={location.formattedAddress}
          onChange={(e) =>
            setLocation({ ...location, formattedAddress: e.target.value })
          }
          className="w-full border rounded px-3 py-2 mb-2"
          placeholder="Formatted Address"
        />

        <MapSelector value={location} onChange={setLocation} />
      </div>

      <button
        type="submit"
        className="w-full bg-yellow-800 text-white py-2 rounded hover:bg-yellow-700"
      >
        Update User
      </button>
    </form>
  );
}