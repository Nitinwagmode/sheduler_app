"use client"; // Mark as a Client Component

import { useState, Fragment } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Dialog, Transition } from "@headlessui/react";
import { CSSTransition } from "react-transition-group";
import { FiAlertTriangle } from "react-icons/fi"; // Using react-icons
import Sidebar from "../Sidebar";

const localizer = momentLocalizer(moment);

interface Event {
  title: string;
  start: Date;
  end: Date;
  id: number;
}

export default function Home() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Show delete confirmation modal
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null); // Track the selected event for deletion
  const [newEvent, setNewEvent] = useState<Event>({
    title: "",
    start: new Date(),
    end: new Date(),
    id: 0,
  });

  const [currentView, setCurrentView] = useState(Views.WEEK); // Track the current calendar view
  const [currentDate, setCurrentDate] = useState(new Date()); // Track the current date

  // Handle selecting a date slot
  function handleSelectSlot(slotInfo: { start: Date; end: Date }) {
    setNewEvent({
      title: "",
      start: slotInfo.start,
      end: slotInfo.end,
      id: new Date().getTime(),
    });
    setShowModal(true);
  }

  // Handle adding new events
  function handleEventAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAllEvents([...allEvents, newEvent]);
    setShowModal(false);
    setNewEvent({ title: "", start: new Date(), end: new Date(), id: 0 });
  }

  // Handle view change (Month, Week, Day)
  function handleViewChange(view: string) {
    setCurrentView(view); // Update the view state
  }

  // Handle navigation (Back, Next, Today)
  function handleNavigate(date: Date) {
    setCurrentDate(date); // Update the current date state when navigating
  }

  // Handle selecting an existing event to delete
  function handleSelectEvent(event: Event) {
    setSelectedEvent(event);
    setShowDeleteModal(true); // Open delete modal
  }

  // Handle deleting the event
  function handleDeleteEvent() {
    if (selectedEvent) {
      const updatedEvents = allEvents.filter((e) => e.id !== selectedEvent.id);
      setAllEvents(updatedEvents);
      setShowDeleteModal(false);
      setSelectedEvent(null);
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Main content area with margin-left using Tailwind */}
      <main className="flex-grow ml-64 p-20 bg-gradient-to-br from-blue-900 via-purple-600 to-pink-500 animate_animated animate_fadeIn">
        <div className="flex justify-center">
          <div className="lg:w-8/12 bg-white bg-opacity-90 rounded-lg shadow-2xl p-10">
            <Calendar
              localizer={localizer}
              events={allEvents}
              selectable
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              views={["month", "week", "day"]}
              view={currentView} // Set the current view from state
              date={currentDate} // Set the current date from state
              onView={handleViewChange} // Update view when buttons are clicked
              onNavigate={handleNavigate} // Update date when navigating through calendar
              step={30} // 30-minute steps
              timeslots={2} // Show two 30-minute slots per hour
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent} // Select an event to delete
            />
          </div>
        </div>

        {/* Event Creation Modal */}
        <CSSTransition
          in={showModal}
          timeout={300}
          classNames="fade"
          unmountOnExit
        >
          <Transition.Root show={showModal} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-10"
              onClose={() => setShowModal(false)}
            >
              <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
              <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex items-center justify-center min-h-full p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Dialog.Panel className="bg-gradient-to-br from-yellow-100 to-green-100 rounded-lg p-6 shadow-2xl">
                      <form onSubmit={handleEventAdd}>
                        <h3 className="font-bold text-lg mb-4 text-gray-700">
                          📝 Create New Event
                        </h3>
                        <input
                          type="text"
                          className="border border-gray-300 p-2 w-full rounded focus:ring-4 focus:ring-green-300 focus:outline-none"
                          placeholder="Event Title"
                          value={newEvent.title}
                          onChange={(e) =>
                            setNewEvent({ ...newEvent, title: e.target.value })
                          }
                          required
                        />
                        <div className="mt-4 flex justify-end space-x-4">
                          <button
                            type="submit"
                            className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded shadow-lg"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="bg-gradient-to-r from-gray-400 to-gray-600 text-white px-4 py-2 rounded shadow-lg"
                            onClick={() => setShowModal(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition.Root>
        </CSSTransition>

        {/* Delete Confirmation Modal */}
        {selectedEvent && (
          <CSSTransition
            in={showDeleteModal}
            timeout={300}
            classNames="fade"
            unmountOnExit
          >
            <Transition.Root show={showDeleteModal} as={Fragment}>
              <Dialog
                as="div"
                className="relative z-10"
                onClose={() => setShowDeleteModal(false)}
              >
                <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
                <div className="fixed inset-0 z-10 overflow-y-auto">
                  <div className="flex items-center justify-center min-h-full p-4 text-center">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Dialog.Panel className="bg-gradient-to-br from-red-100 to-pink-100 rounded-lg p-6 shadow-2xl">
                        <div className="text-center">
                          <FiAlertTriangle className="text-red-500 mx-auto mb-4 h-12 w-12" />
                          <h3 className="font-bold text-lg text-gray-700">
                            Delete Event
                          </h3>
                          <p className="text-gray-600">
                            Are you sure you want to delete this event?
                          </p>
                          <div className="mt-4 flex justify-center space-x-4">
                            <button
                              className="bg-red-500 text-white px-4 py-2 rounded shadow-lg"
                              onClick={handleDeleteEvent}
                            >
                              Delete
                            </button>
                            <button
                              className="bg-gray-400 text-white px-4 py-2 rounded shadow-lg"
                              onClick={() => setShowDeleteModal(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition.Root>
          </CSSTransition>
        )}
      </main>
    </div>
  );
}