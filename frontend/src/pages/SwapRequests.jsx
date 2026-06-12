import { useEffect, useState } from "react";
import { FiInbox, FiSend, FiCheck, FiX } from "react-icons/fi";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import FadeIn from "../components/ui/FadeIn";

import { useAuth } from "../context/AuthContext";
import { getSentRequests, getReceivedRequests, acceptRequest, rejectRequest } from "../api/requests";
import { addNotification } from "../lib/localStore";
import { notify } from "../lib/toast";

// =========================================================================
//  Swap Requests — manage requests you've sent and received
// =========================================================================
export default function SwapRequests() {
  const { userId } = useAuth();
  const [tab, setTab] = useState("received");
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [s, r] = await Promise.all([
        getSentRequests(userId).catch(() => []),
        getReceivedRequests(userId).catch(() => []),
      ]);
      setSent(s);
      setReceived(r);
    } catch {
      notify.error("Couldn't load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const handleAccept = async (req) => {
    try {
      await acceptRequest(req.id);
      addNotification(userId, {
        title: "Request accepted",
        body: `You accepted ${req.sender?.name}'s request for "${req.book?.title}".`,
        type: "success",
      });
      notify.success("Request accepted");
      load();
    } catch { notify.error("Could not accept"); }
  };

  const handleReject = async (req) => {
    try {
      await rejectRequest(req.id);
      notify.success("Request rejected");
      load();
    } catch { notify.error("Could not reject"); }
  };

  if (loading) return <Spinner full />;

  const list = tab === "received" ? received : sent;

  return (
    <FadeIn>
      <div className="page-header">
        <h1 style={{ marginBottom: 8 }}>Swap requests</h1>
        <p>Track requests you've received and the ones you've sent.</p>
      </div>

      {/* Tabs */}
      <div className="row" style={{ gap: 8, marginBottom: 24 }}>
        <Button variant={tab === "received" ? "primary" : "outline"} size="sm" onClick={() => setTab("received")}>
          <FiInbox /> Received ({received.length})
        </Button>
        <Button variant={tab === "sent" ? "primary" : "outline"} size="sm" onClick={() => setTab("sent")}>
          <FiSend /> Sent ({sent.length})
        </Button>
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={tab === "received" ? <FiInbox /> : <FiSend />}
          title={tab === "received" ? "No requests received" : "No requests sent"}
          message={tab === "received"
            ? "When someone requests one of your books, it'll appear here."
            : "Browse the library and request a book to get started."}
        />
      ) : (
        <div className="stack">
          {list.map((req) => (
            <Card key={req.id} className="row-between wrap" hover>
              <div>
                <div className="row" style={{ gap: 10, marginBottom: 6 }}>
                  <h3 style={{ margin: 0 }}>{req.book?.title}</h3>
                  <Badge status={req.status} />
                </div>
                <p style={{ margin: 0, fontSize: "0.9rem" }}>
                  {tab === "received"
                    ? <>Requested by <strong style={{ color: "#fff" }}>{req.sender?.name}</strong></>
                    : <>Owner: <strong style={{ color: "#fff" }}>{req.receiver?.name}</strong></>}
                </p>
              </div>

              {tab === "received" && req.status === "PENDING" && (
                <div className="row">
                  <Button variant="success" size="sm" onClick={() => handleAccept(req)}><FiCheck /> Accept</Button>
                  <Button variant="danger" size="sm" onClick={() => handleReject(req)}><FiX /> Reject</Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </FadeIn>
  );
}
