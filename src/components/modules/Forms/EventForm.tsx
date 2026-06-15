"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { IEventCreate, EventStatus } from "@/types";
import { ILocation } from "@/types";
import SingleImageUploader from "@/components/SingleImageUploder";

const MapSelector = dynamic(() => import("@/components/ui/MapSelector"), {
  ssr: false,
});

type EventFormProps = {
  event?: IEventCreate;
  onSubmit: (data: FormData) => Promise<void>;
  submitting?: boolean;
};

export default function EventForm({ event, onSubmit, submitting }: EventFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    title: event?.title || "",
    eventType: event?.eventType || "",
    description: event?.description || "",
    minParticipants: event?.minParticipants?.toString() || "",
    maxParticipants: event?.maxParticipants?.toString() || "",
    joiningFee: event?.joiningFee?.toString() || "",
    status: (event?.status || "OPEN") as EventStatus,
    startDate: event?.startDate ? new Date(event.startDate).toISOString().slice(0, 10) : "",
    startTime: event?.startDate ? new Date(event.startDate).toISOString().slice(11, 16) : "",
    endDate: event?.endDate ? new Date(event.endDate).toISOString().slice(0, 10) : "",
    endTime: event?.endDate ? new Date(event.endDate).toISOString().slice(11, 16) : "",
  });

  const [location, setLocation] = useState<ILocation>(
    event?.location || {
      lat: 24.8949,
      lng: 91.8687,
      formattedAddress: "Sylhet, Bangladesh",
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleManualLatLngChange = (latStr: string, lngStr: string) => {
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    if (!isNaN(lat) && !isNaN(lng))
      setLocation((prev) => ({ ...prev, lat, lng }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const formData = new FormData();

  formData.append(
    "data",
    JSON.stringify({
      title: form.title,
      eventType: form.eventType || null,
      description: form.description,
      minParticipants: form.minParticipants ? Number(form.minParticipants) : null,
      maxParticipants: form.maxParticipants ? Number(form.maxParticipants) : null,
      joiningFee: form.joiningFee ? Number(form.joiningFee) : 0,
      status: form.status,
      startDate: `${form.startDate}T${form.startTime}:00`,
      endDate: `${form.endDate}T${form.endTime}:00`,      
      location: {
        lat: location.lat,
        lng: location.lng,
        formattedAddress: location.formattedAddress || "",
      },
    })
  );

  if (imageFile) formData.append("file", imageFile);
  await onSubmit(formData);
};

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full mx-auto p-1 md:p-6 space-y-4 border rounded shadow"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Event Type</label>
          <input
            name="eventType"
            value={form.eventType}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Min Participants</label>
          <input
            name="minParticipants"
            value={form.minParticipants}
            onChange={handleChange}
            type="number"
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Max Participants</label>
          <input
            name="maxParticipants"
            value={form.maxParticipants}
            onChange={handleChange}
            type="number"
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Joining Fee</label>
          <input
            name="joiningFee"
            value={form.joiningFee}
            onChange={handleChange}
            type="number"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="OPEN">OPEN</option>
            <option value="FULL">FULL</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Start Date & Time</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleChange}
            min={new Date().toISOString().slice(0, 10)}
            className="w-full border px-3 py-2 rounded text-sm"
            required
          />
          <input
            name="startTime"
            type="time"
            value={form.startTime}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-sm"
            required
          />
        </div>
      </div>

      {/* End */}
      <div>
        <label className="block text-sm font-medium mb-1">End Date & Time</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={handleChange}
            min={form.startDate || new Date().toISOString().slice(0, 10)}
            className="w-full border px-3 py-2 rounded text-sm"
            required
          />
          <input
            name="endTime"
            type="time"
            value={form.endTime}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-sm"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Event Image</label>
        <SingleImageUploader
          onChange={(file) => file instanceof File && setImageFile(file)}
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
            className="border px-3 py-2 rounded"
            placeholder="Latitude"
            step="any"
          />
          <input
            type="number"
            value={location.lng}
            onChange={(e) =>
              handleManualLatLngChange(String(location.lat), e.target.value)
            }
            className="border px-3 py-2 rounded"
            placeholder="Longitude"
            step="any"
          />
        </div>
        <input
          value={location.formattedAddress}
          onChange={(e) =>
            setLocation({ ...location, formattedAddress: e.target.value })
          }
          className="w-full border px-3 py-2 rounded mb-2"
          placeholder="Formatted Address"
        />
        <MapSelector value={location} onChange={setLocation} />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-yellow-800 py-2 rounded text-white hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Saving..." : "Save Event"}
      </button>
    </form>
  );
}