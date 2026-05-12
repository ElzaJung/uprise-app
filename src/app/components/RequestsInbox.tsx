import { useState } from "react";
import { useNavigate } from "react-router";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Send,
} from "lucide-react";

type RequestStatus = "pending" | "accepted" | "declined";

interface Request {
  id: string;
  parcelId: string;
  parcelAddress: string;
  from: {
    name: string;
    type: string;
    anonymous: boolean;
  };
  message: string;
  sentDate: string;
  status: RequestStatus;
  unread: boolean;
}

const mockRequests: Request[] = [
  {
    id: "REQ-001",
    parcelId: "PCL-ABC123",
    parcelAddress: "1234 Mountain View Road, Green County, CA",
    from: {
      name: "Solar Energy Partners LLC",
      type: "Energy Developer",
      anonymous: false,
    },
    message:
      "We are interested in discussing a solar development partnership for your property. We have experience with similar projects in the region and would like to explore collaboration opportunities.",
    sentDate: "2024-03-18",
    status: "pending",
    unread: true,
  },
  {
    id: "REQ-002",
    parcelId: "PCL-DEF456",
    parcelAddress: "567 Valley Creek Lane, Blue County, OR",
    from: {
      name: "Anonymous",
      type: "Agriculture Investor",
      anonymous: true,
    },
    message:
      "Interested in learning more about your property for organic farming operations. Can we schedule a call?",
    sentDate: "2024-03-16",
    status: "pending",
    unread: false,
  },
  {
    id: "REQ-003",
    parcelId: "PCL-ABC123",
    parcelAddress: "1234 Mountain View Road, Green County, CA",
    from: {
      name: "Green Community Developers",
      type: "Community Developer",
      anonymous: false,
    },
    message:
      "We would like to discuss potential community housing development on your land.",
    sentDate: "2024-03-14",
    status: "accepted",
    unread: false,
  },
];

export default function RequestsInbox() {
  const navigate = useNavigate();
  const [requests, setRequests] =
    useState<Request[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] =
    useState<Request | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    RequestStatus | "all"
  >("all");

  const filteredRequests =
    filterStatus === "all"
      ? requests
      : requests.filter((r) => r.status === filterStatus);

  const handleStatusChange = (
    requestId: string,
    newStatus: RequestStatus,
  ) => {
    setRequests(
      requests.map((r) =>
        r.id === requestId ? { ...r, status: newStatus } : r,
      ),
    );
  };

  const getStatusBadge = (status: RequestStatus) => {
    const configs = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Pending",
      },
      accepted: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Accepted",
      },
      declined: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Declined",
      },
    };
    const config = configs[status];
    return (
      <span
        className={`px-3 py-1 ${config.bg} ${config.text} text-sm font-medium rounded-full`}
      >
        {config.label}
      </span>
    );
  };

  return (
      <div className="h-full flex bg-gray-50">
        {/* Sidebar - Request List */}
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Requests
            </h1>

            {/* Filter */}
            <div className="flex gap-2">
              {[
                { value: "all", label: "All" },
                { value: "pending", label: "Pending" },
                { value: "accepted", label: "Accepted" },
                { value: "declined", label: "Declined" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() =>
                    setFilterStatus(filter.value as any)
                  }
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    filterStatus === filter.value
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Request List */}
          <div className="flex-1 overflow-auto">
            {filteredRequests.length === 0 ? (
              <div className="p-6 text-center">
                <MessageSquare className="size-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">
                  No requests found
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <button
                    key={request.id}
                    onClick={() => {
                      setSelectedRequest(request);
                      setRequests(
                        requests.map((r) =>
                          r.id === request.id
                            ? { ...r, unread: false }
                            : r,
                        ),
                      );
                    }}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedRequest?.id === request.id
                        ? "bg-emerald-50"
                        : ""
                    } ${request.unread ? "bg-blue-50/50" : ""}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p
                            className={`text-sm font-medium text-gray-900 truncate ${
                              request.unread
                                ? "font-semibold"
                                : ""
                            }`}
                          >
                            {request.from.name}
                          </p>
                          {request.unread && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-1">
                          {request.from.type}
                        </p>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {request.message}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="size-3" />
                      {new Date(
                        request.sentDate,
                      ).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content - Request Details */}
        <div className="flex-1 flex flex-col">
          {selectedRequest ? (
            <>
              {/* Header */}
              <div className="bg-white border-b border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                      {selectedRequest.from.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {selectedRequest.from.type}
                    </p>
                  </div>
                  {getStatusBadge(selectedRequest.status)}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>
                    Re: {selectedRequest.parcelAddress}
                  </span>
                </div>
              </div>

              {/* Message */}
              <div className="flex-1 overflow-auto p-6">
                <div className="max-w-3xl">
                  <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-blue-600">
                          {selectedRequest.from.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900">
                            {selectedRequest.from.name}
                          </p>
                          <span className="text-xs text-gray-500">
                            {new Date(
                              selectedRequest.sentDate,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {selectedRequest.message}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Parcel Info */}
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Related Parcel
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {selectedRequest.parcelAddress}
                    </p>
                    <button
                      onClick={() =>
                        navigate(
                          `/parcel/${selectedRequest.parcelId}`,
                        )
                      }
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <Eye className="size-4" />
                      View Parcel Details
                    </button>
                  </div>

                  {/* Actions */}
                  {selectedRequest.status === "pending" && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Response
                      </h3>
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            handleStatusChange(
                              selectedRequest.id,
                              "accepted",
                            )
                          }
                          className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="size-5" />
                          Accept & Start Conversation
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(
                              selectedRequest.id,
                              "declined",
                            )
                          }
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold flex items-center gap-2"
                        >
                          <XCircle className="size-5" />
                          Decline
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedRequest.status === "accepted" && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Continue Conversation
                      </h3>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          placeholder="Type your message..."
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        />
                        <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold flex items-center gap-2">
                          <Send className="size-5" />
                          Send
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="size-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">
                  Select a request to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
  );
}