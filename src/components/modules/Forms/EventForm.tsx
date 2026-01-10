"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { IEventCreate, EventStatus, IHostCreate } from "@/types";
import { ILocation } from "@/types";
import SingleImageUploader from "@/components/SingleImageUploder";

const MapSelector = dynamic(() => import("@/components/ui/MapSelector"), {
  ssr: false,
});

type EventFormProps = {
  event?: IEventCreate; 
  hosts: IHostCreate[];
  onSubmit: (data: FormData) => Promise<void>;
};

export default function EventForm({ event, hosts, onSubmit }: EventFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    title: "",
    eventType: "",
    description: "",
    hostId: hosts[0]?.userId || "",
    minParticipants: "",
    maxParticipants: "",
    joiningFee: "",
    status: "OPEN" as EventStatus,
  });

  const [location, setLocation] = useState<ILocation>({
    lat: 24.8949,
    lng: 91.8687,
    formattedAddress: "Sylhet, Bangladesh",
  });

  useEffect(() => {
    if (!event) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      title: event.title || "",
      eventType: event.eventType || "",
      description: event.description || "",
      hostId: event.hostId,
      minParticipants: event.minParticipants?.toString() || "",
      maxParticipants: event.maxParticipants?.toString() || "",
      joiningFee: event.joiningFee?.toString() || "",
      status: event.status || "OPEN",
    });

    setLocation(event.location || { lat: 24.8949, lng: 91.8687, formattedAddress: "Sylhet, Bangladesh" });
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleManualLatLngChange = (latStr: string, lngStr: string) => {
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    if (!isNaN(lat) && !isNaN(lng)) setLocation(prev => ({ ...prev, lat, lng }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("eventType", form.eventType);
    formData.append("description", form.description);
    formData.append("hostId", form.hostId);
    if (form.minParticipants) formData.append("minParticipants", form.minParticipants);
    if (form.maxParticipants) formData.append("maxParticipants", form.maxParticipants);
    if (form.joiningFee) formData.append("joiningFee", form.joiningFee);
    formData.append("status", form.status);
    formData.append("location", JSON.stringify(location));
    if (imageFile) formData.append("image", imageFile);

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto p-6 space-y-4 border rounded shadow">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input name="title" value={form.title} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
      </div>

      <div>
        <label className="block text-sm font-medium">Event Type</label>
        <input name="eventType" value={form.eventType} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} className="w-full border px-3 py-2 rounded" rows={4} />
      </div>

      <div>
        <label className="block text-sm font-medium">Host</label>
        <select name="hostId" value={form.hostId} onChange={handleChange} className="w-full border px-3 py-2 rounded">
          {hosts.map(host => (
            <option key={host.userId} value={host.userId}>{host.userId}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Min Participants</label>
          <input name="minParticipants" value={form.minParticipants} onChange={handleChange} type="number" className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Max Participants</label>
          <input name="maxParticipants" value={form.maxParticipants} onChange={handleChange} type="number" className="w-full border px-3 py-2 rounded" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Joining Fee</label>
        <input name="joiningFee" value={form.joiningFee} onChange={handleChange} type="number" className="w-full border px-3 py-2 rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium">Status</label>
        <select name="status" value={form.status} onChange={handleChange} className="w-full border px-3 py-2 rounded">
          <option value="OPEN">OPEN</option>
          <option value="FULL">FULL</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Profile Image</label>
        <SingleImageUploader onChange={file => file instanceof File && setImageFile(file)} />
      </div>

      <div>
        <p className="text-xs mb-2">Tip: Select location (lat, lng) using map and edit manually!</p>
        <div className="grid grid-cols-2 gap-3 mb-2">
          <input type="number" value={location.lat} onChange={e => handleManualLatLngChange(e.target.value, String(location.lng))} className="border px-3 py-2 rounded" placeholder="Latitude" />
          <input type="number" value={location.lng} onChange={e => handleManualLatLngChange(String(location.lat), e.target.value)} className="border px-3 py-2 rounded" placeholder="Longitude" />
        </div>
        <input value={location.formattedAddress} onChange={e => setLocation({ ...location, formattedAddress: e.target.value })} className="w-full border px-3 py-2 rounded mb-2" placeholder="Formatted Address" />
        <MapSelector value={location} onChange={setLocation} />
      </div>

      <button type="submit" className="w-full bg-yellow-800 py-2 rounded text-white hover:bg-yellow-700">Save Event</button>
    </form>
  );
}