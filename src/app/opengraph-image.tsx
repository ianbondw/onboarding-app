import { ImageResponse } from "next/og";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(circle at top left, rgba(215,155,59,0.28), transparent 30%), radial-gradient(circle at 80% 16%, rgba(75,169,199,0.26), transparent 24%), linear-gradient(145deg, #fbf7ef 0%, #f3eadf 100%)",
          color: "#111827",
          padding: "56px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 28,
            borderRadius: 36,
            border: "1px solid rgba(17,24,39,0.08)",
            background: "rgba(255,255,255,0.72)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.86)",
                border: "1px solid rgba(17,24,39,0.08)",
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 999,
                  background: "linear-gradient(135deg, #d79b3b 0%, #4ba9c7 100%)",
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: 18,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "#7c8697",
                }}
              >
                Marengo Finance
              </div>
              <div style={{ fontSize: 30, fontWeight: 700 }}>Client onboarding for RIAs</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 930 }}>
            <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.02 }}>
              Modern enough to sell. Strong enough to run.
            </div>
            <div style={{ fontSize: 30, lineHeight: 1.35, color: "#465064" }}>
              Guided trials, advisor workspaces, rollout pricing, and a cleaner path from
              first interest to funded client.
            </div>
          </div>

          <div style={{ display: "flex", gap: 14 }}>
            {["Guided trials", "Advisor workspaces", "Rollout-ready operations"].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "12px 20px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.8)",
                  border: "1px solid rgba(17,24,39,0.08)",
                  fontSize: 20,
                  color: "#243043",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
