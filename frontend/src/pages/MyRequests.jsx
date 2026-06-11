import { useEffect, useState } from "react";
import api from "../api";

export default function MyRequests() {
    const [sentRequests, setSentRequests] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);

    const userId = localStorage.getItem("userId");

    const loadRequests = async () => {
        try {
            const sentResponse = await api.get(
                `/requests/sent/${userId}`
            );

            const receivedResponse = await api.get(
                `/requests/received/${userId}`
            );

            setSentRequests(sentResponse.data);
            setReceivedRequests(receivedResponse.data);
        } catch (error) {
            console.error(error);
        }
    };

    const acceptRequest = async (requestId) => {
        try {
            await api.put(`/requests/accept/${requestId}`);

            alert("Request Accepted");

            loadRequests();
        } catch (error) {
            console.error(error);
        }
    };

    const rejectRequest = async (requestId) => {
        try {
            await api.put(`/requests/reject/${requestId}`);

            alert("Request Rejected");

            loadRequests();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    return (
        <div>
            <h1>My Requests</h1>

            <h2>Sent Requests</h2>

            {sentRequests.length === 0 ? (
                <p>No Sent Requests</p>
            ) : (
                sentRequests.map((request) => (
                    <div key={request.id}>
                        <h3>{request.book.title}</h3>

                        <p>Status: {request.status}</p>

                        <p>Owner: {request.receiver.name}</p>

                        <hr />
                    </div>
                ))
            )}

            <br />

            <h2>Received Requests</h2>

            {receivedRequests.length === 0 ? (
                <p>No Received Requests</p>
            ) : (
                receivedRequests.map((request) => (
                    <div key={request.id}>
                        <h3>{request.book.title}</h3>

                        <p>Requested By: {request.sender.name}</p>

                        <p>Status: {request.status}</p>

                        {request.status === "PENDING" && (
                            <>
                                <button
                                    onClick={() =>
                                        acceptRequest(request.id)
                                    }
                                >
                                    Accept
                                </button>

                                <button
                                    onClick={() =>
                                        rejectRequest(request.id)
                                    }
                                >
                                    Reject
                                </button>
                            </>
                        )}

                        <hr />
                    </div>
                ))
            )}
        </div>
    );
}