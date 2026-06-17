import { useState } from "react";
import axios from "axios";
const BACKEND_URI = import.meta.env.VITE_BACKEND_URL;
import QRCode from "react-qr-code";
import QRCodeGenerator from "qrcode";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrimage, setQrImage] = useState("");

  const handleShortenurl = async () => {
    if (!url) {
      alert("Please enter a URL");
      return;
    }
    try {
      const res = await axios.post(`${BACKEND_URI}/api/shorten`, {
        originalUrl: url,
      });

      const newSHortUrl = res.data.shortUrl;
      setShortUrl(newSHortUrl);
      setCopied(false);

      const qr = await QRCodeGenerator.toDataURL(newSHortUrl);
      setQrImage(qr);
      // settQrImage(`${BACKEND_URL}/qr/${newSHortUrl}`);
    } catch (error) {
      console.error("Error shortening URL:", error);
      alert("Failed to shorten URL. Please try again.");
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const downloadQR = () => {
    const link = document.createElement("a");
    link.href = qrimage;
    link.download = "qrcode.png";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-950 to-blac flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-8 text-center border-b border-slate-800">
          <h1 className="text-5xl font-bold text-white mb-3">
            URL Shortener & QR Generator
          </h1>
          <p className="text-slate-400">
            Create short links and instantly generate QR codes.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Left Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-slate-300 mb-2">Enter URL</label>

              <input
                type="url"
                placeholder="https://example.com"
                className="w-full px-4 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <button
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold text-white transition"
              onClick={handleShortenurl}
            >
              Generate Short URL
            </button>

            {/* Result */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <p className="text-slate-400 text-sm mb-2">Shortened URL</p>

              <div className="flex justify-between items-center gap-3">
                <span className="text-indigo-400 break-all">
                  {shortUrl || "Your shortened URL will appear here"}
                </span>

                <button
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white"
                  onClick={handleCopy}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

          {/* QR Section */}
          <div className="flex flex-col items-center justify-center">
            <div className="bg-white p-5 rounded-2xl shadow-lg">
              {/* QR Image Here */}
              {qrimage ? (
                <img src={qrimage} alt="QR Code" className="w-64 h-64" />
              ) : (
                <div className="w-64 h-64 flex items-center justify-center text-slate-400">
                  QR code will appear here
                </div>
              )}

              <button
                onClick={downloadQR}
                disabled={!qrimage}
                className="mt-5 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-white"
              >
                Download QR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
