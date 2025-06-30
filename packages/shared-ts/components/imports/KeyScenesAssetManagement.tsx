import svgPaths from "./svg-003";
// TODO: Replace figma asset imports with proper static assets
// import imgRectangle from "figma:asset/8c248244a03c4b443811e8029b4c48959592e6c0.png";
// import imgRectangle1 from "figma:asset/ab98422fa7253d5ff7b3cd22d128b48c28a20ea3.png";

// Placeholder images until proper assets are available
const imgRectangle = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face";
const imgRectangle1 = "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=32&h=32&fit=crop&crop=face";

function Group() {
  return (
    <div
      className="absolute bottom-[8.333%] left-[33.333%] right-[33.333%] top-[45.833%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 8 11"
      >
        <g id="Group">
          <path
            d={svgPaths.p1efde300}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div
      className="absolute bottom-[8.335%] left-[8.333%] right-[8.333%] top-[4.169%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 21"
      >
        <g id="Group">
          <path
            d={svgPaths.p305ee700}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group2() {
  return (
    <div
      className="absolute bottom-[8.333%] contents left-[8.333%] right-[8.333%] top-[4.169%]"
      data-name="Group"
    >
      <Group />
      <Group1 />
    </div>
  );
}

function Group3() {
  return (
    <div
      className="absolute bottom-[8.333%] contents left-[8.333%] right-[8.333%] top-[4.169%]"
      data-name="Group"
    >
      <Group2 />
    </div>
  );
}

function House() {
  return (
    <div
      className="absolute left-[23px] overflow-clip size-6 top-4"
      data-name="house"
    >
      <Group3 />
    </div>
  );
}

function Group4() {
  return (
    <div
      className="absolute bottom-[8.333%] left-[65.251%] right-[8.333%] top-[65.251%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 7 7"
      >
        <g id="Group">
          <path
            d={svgPaths.p397ac380}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group5() {
  return (
    <div
      className="absolute bottom-[16.667%] left-[8.333%] right-[16.667%] top-[8.333%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 18 18"
      >
        <g id="Group">
          <path
            d={svgPaths.p24b38b80}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group6() {
  return (
    <div
      className="absolute bottom-[8.333%] contents left-[8.333%] right-[8.333%] top-[8.333%]"
      data-name="Group"
    >
      <Group4 />
      <Group5 />
    </div>
  );
}

function Group7() {
  return (
    <div
      className="absolute bottom-[8.333%] contents left-[8.333%] right-[8.333%] top-[8.333%]"
      data-name="Group"
    >
      <Group6 />
    </div>
  );
}

function Search() {
  return (
    <div
      className="absolute left-[23px] overflow-clip size-6 top-[72px]"
      data-name="search"
    >
      <Group7 />
    </div>
  );
}

function Group8() {
  return (
    <div
      className="absolute bottom-[4.167%] left-[38.614%] right-[38.615%] top-[83.332%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 6 3"
      >
        <g id="Group">
          <path
            d={svgPaths.p1040b500}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group9() {
  return (
    <div
      className="absolute bottom-1/4 left-[8.337%] right-[8.332%] top-[4.167%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 17"
      >
        <g id="Group">
          <path
            d={svgPaths.p2b908300}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group10() {
  return (
    <div
      className="absolute bottom-[4.167%] contents left-[8.337%] right-[8.332%] top-[4.167%]"
      data-name="Group"
    >
      <Group8 />
      <Group9 />
    </div>
  );
}

function Group11() {
  return (
    <div
      className="absolute bottom-[4.167%] contents left-[8.337%] right-[8.332%] top-[4.167%]"
      data-name="Group"
    >
      <Group10 />
    </div>
  );
}

function Bell() {
  return (
    <div
      className="absolute left-[23px] overflow-clip size-6 top-32"
      data-name="bell"
    >
      <Group11 />
    </div>
  );
}

function Group12() {
  return (
    <div
      className="absolute bottom-[8.333%] left-[8.333%] right-[8.333%] top-[58.333%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 8"
      >
        <g id="Group">
          <path
            d={svgPaths.p332ae480}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group13() {
  return (
    <div
      className="absolute bottom-[62.5%] left-[25%] right-[25.001%] top-[8.334%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 12 7"
      >
        <g id="Group">
          <path
            d={svgPaths.p35100b80}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group14() {
  return (
    <div
      className="absolute bottom-[33.333%] left-[45.833%] right-[45.833%] top-[8.333%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 2 14"
      >
        <g id="Group">
          <path
            d={svgPaths.p22294900}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group15() {
  return (
    <div className="absolute contents inset-[8.333%]" data-name="Group">
      <Group12 />
      <Group13 />
      <Group14 />
    </div>
  );
}

function Group16() {
  return (
    <div className="absolute contents inset-[8.333%]" data-name="Group">
      <Group15 />
    </div>
  );
}

function Upload() {
  return (
    <div
      className="absolute left-[23px] overflow-clip size-6 top-[184px]"
      data-name="upload"
    >
      <Group16 />
    </div>
  );
}

function Group17() {
  return (
    <div
      className="absolute bottom-[8.333%] left-[45.833%] right-[45.833%] top-1/4"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 2 16"
      >
        <g id="Group">
          <path
            d={svgPaths.p8816400}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group18() {
  return (
    <div
      className="absolute bottom-[8.333%] left-[4.167%] right-[4.167%] top-[8.333%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 22 20"
      >
        <g id="Group">
          <path
            d={svgPaths.p21ecde80}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group19() {
  return (
    <div
      className="absolute bottom-[8.333%] contents left-[4.167%] right-[4.167%] top-[8.333%]"
      data-name="Group"
    >
      <Group17 />
      <Group18 />
    </div>
  );
}

function Group20() {
  return (
    <div
      className="absolute bottom-[8.333%] contents left-[4.167%] right-[4.167%] top-[8.333%]"
      data-name="Group"
    >
      <Group19 />
    </div>
  );
}

function BookOpen() {
  return (
    <div
      className="absolute left-[23px] overflow-clip size-6 top-60"
      data-name="book-open"
    >
      <Group20 />
    </div>
  );
}

function Group21() {
  return (
    <div
      className="absolute bottom-[8.033%] left-[4.159%] right-[4.167%] top-[4.167%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 22 22"
      >
        <g id="Group">
          <path
            d={svgPaths.pf5a900}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group22() {
  return (
    <div
      className="absolute bottom-[8.033%] contents left-[4.159%] right-[4.167%] top-[4.167%]"
      data-name="Group"
    >
      <Group21 />
    </div>
  );
}

function Group23() {
  return (
    <div
      className="absolute bottom-[8.033%] contents left-[4.159%] right-[4.167%] top-[4.167%]"
      data-name="Group"
    >
      <Group22 />
    </div>
  );
}

function Star() {
  return (
    <div
      className="absolute left-[23px] overflow-clip size-6 top-[296px]"
      data-name="star"
    >
      <Group23 />
    </div>
  );
}

function Group24() {
  return (
    <div
      className="absolute bottom-[12.5%] left-[8.333%] right-[8.333%] top-[12.5%]"
      data-name="Group"
    >
      <div className="absolute bottom-[-5.556%] left-[-5%] right-[-5%] top-[-5.556%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 22 20"
        >
          <g id="Group">
            <path
              d={svgPaths.p2d3e9c00}
              id="Vector"
              stroke="var(--stroke-0, #A0A3B5)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group25() {
  return (
    <div
      className="absolute bottom-[12.5%] contents left-[8.333%] right-[8.333%] top-[12.5%]"
      data-name="Group"
    >
      <Group24 />
    </div>
  );
}

function Group26() {
  return (
    <div
      className="absolute bottom-[12.5%] contents left-[8.333%] right-[8.333%] top-[12.5%]"
      data-name="Group"
    >
      <Group25 />
    </div>
  );
}

function Image() {
  return (
    <div className="absolute left-[23px] size-6 top-[352px]" data-name="Image">
      <div className="overflow-clip relative size-6">
        <Group26 />
      </div>
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Group27() {
  return (
    <div
      className="absolute bottom-[54.167%] left-[8.333%] right-[54.167%] top-[8.333%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 9 9"
      >
        <g id="Group">
          <path
            d={svgPaths.pc91a200}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group28() {
  return (
    <div
      className="absolute bottom-[54.167%] left-[54.167%] right-[8.333%] top-[8.333%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 9 9"
      >
        <g id="Group">
          <path
            d={svgPaths.pb328d00}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group29() {
  return (
    <div
      className="absolute bottom-[8.333%] left-[54.167%] right-[8.333%] top-[54.167%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 9 9"
      >
        <g id="Group">
          <path
            d={svgPaths.p1d7cee00}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group30() {
  return (
    <div
      className="absolute bottom-[8.333%] left-[8.333%] right-[54.167%] top-[54.167%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 9 9"
      >
        <g id="Group">
          <path
            d={svgPaths.p1d63a100}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group31() {
  return (
    <div className="absolute contents inset-[8.333%]" data-name="Group">
      <Group27 />
      <Group28 />
      <Group29 />
      <Group30 />
    </div>
  );
}

function Group32() {
  return (
    <div className="absolute contents inset-[8.333%]" data-name="Group">
      <Group31 />
    </div>
  );
}

function LayoutGrid() {
  return (
    <div
      className="absolute left-[23px] overflow-clip size-6 top-[408px]"
      data-name="layout-grid"
    >
      <Group32 />
    </div>
  );
}

function Group33() {
  return (
    <div
      className="absolute bottom-[50.169%] left-[50.267%] right-[4.765%] top-[4.78%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 18 19"
      >
        <g id="Group">
          <path
            d={svgPaths.p2ad6ef00}
            fill="var(--fill-0, #22CCB2)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group34() {
  return (
    <div
      className="absolute bottom-[4.761%] left-[14.552%] right-[50.209%] top-[50.207%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 19"
      >
        <g id="Group">
          <path
            d={svgPaths.pf009900}
            fill="var(--fill-0, #636AE8)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group35() {
  return (
    <div
      className="absolute bottom-[50.268%] left-[14.582%] right-[50.121%] top-[4.764%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 18"
      >
        <g id="Group">
          <path
            d={svgPaths.p38084a00}
            fill="var(--fill-0, #7F55E0)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group36() {
  return (
    <div
      className="absolute bottom-[75.865%] left-[40.284%] right-[40.23%] top-[6.513%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 8 8"
      >
        <g id="Group">
          <path
            d={svgPaths.p34af9c00}
            fill="var(--fill-0, #7F55E0)"
            fillOpacity="0.5"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group37() {
  return (
    <div
      className="absolute bottom-[40.305%] left-[6.513%] right-[75.865%] top-[40.209%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 8 8"
      >
        <g id="Group">
          <path
            d={svgPaths.p300a4200}
            fill="var(--fill-0, #636AE8)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group38() {
  return (
    <div
      className="absolute bottom-[4.759%] left-[50.18%] right-[4.77%] top-[50.267%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 19 18"
      >
        <g id="Group">
          <path
            d={svgPaths.p2e544f00}
            fill="var(--fill-0, #E8618C)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group39() {
  return (
    <div
      className="absolute bottom-[40.23%] left-[75.869%] right-[6.509%] top-[40.284%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 8 8"
      >
        <g id="Group">
          <path
            d={svgPaths.p812900}
            fill="var(--fill-0, #E8618C)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group40() {
  return (
    <div
      className="absolute bottom-[6.509%] left-[40.209%] right-[40.305%] top-[75.87%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 8 8"
      >
        <g id="Group">
          <path
            d={svgPaths.p17bae880}
            fill="var(--fill-0, #E8618C)"
            fillOpacity="0.5"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group41() {
  return (
    <div
      className="absolute bottom-[4.759%] contents left-[6.513%] right-[4.765%] top-[4.764%]"
      data-name="Group"
    >
      <Group33 />
      <Group34 />
      <Group35 />
      <Group36 />
      <Group37 />
      <Group38 />
      <Group39 />
      <Group40 />
    </div>
  );
}

function Group42() {
  return (
    <div
      className="absolute bottom-[4.759%] contents left-[6.513%] right-[4.765%] top-[4.764%]"
      data-name="Group"
    >
      <Group41 />
    </div>
  );
}

function Group43() {
  return (
    <div
      className="absolute bottom-[4.759%] contents left-[6.513%] right-[4.765%] top-[4.764%]"
      data-name="Group"
    >
      <Group42 />
    </div>
  );
}

function Group44() {
  return (
    <div
      className="absolute bottom-[4.759%] contents left-[6.513%] right-[4.765%] top-[4.764%]"
      data-name="Group"
    >
      <Group43 />
    </div>
  );
}

function Image1() {
  return (
    <div className="absolute left-[15px] size-10 top-[844px]" data-name="Image">
      <div className="overflow-clip relative size-10">
        <Group44 />
      </div>
      <div className="absolute border-0 border-[#bcc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Container() {
  return (
    <div
      className="absolute bg-[#292b36] h-[900px] left-0 top-0 w-[70px]"
      data-name="Container"
    >
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none" />
      <House />
      <Search />
      <Bell />
      <Upload />
      <BookOpen />
      <Star />
      <Image />
      <LayoutGrid />
      <Image1 />
    </div>
  );
}

function Group45() {
  return (
    <div
      className="absolute bottom-[45.813%] left-[16.5%] right-[16.5%] top-[45.813%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11 2"
      >
        <g id="Group">
          <path
            d={svgPaths.p2e925080}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group46() {
  return (
    <div
      className="absolute bottom-[16.5%] left-[45.813%] right-[45.813%] top-[16.5%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 2 11"
      >
        <g id="Group">
          <path
            d={svgPaths.p4d71480}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group47() {
  return (
    <div className="absolute contents inset-[16.5%]" data-name="Group">
      <Group45 />
      <Group46 />
    </div>
  );
}

function Group48() {
  return (
    <div className="absolute contents inset-[16.5%]" data-name="Group">
      <Group47 />
    </div>
  );
}

function Plus() {
  return (
    <div
      className="absolute left-[247px] overflow-clip size-4 top-[18px]"
      data-name="plus"
    >
      <Group48 />
    </div>
  );
}

function Group49() {
  return (
    <div
      className="absolute bottom-[12.281%] left-[3.938%] right-[3.938%] top-[8.156%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 13"
      >
        <g id="Group">
          <path
            d={svgPaths.p1a422c80}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group50() {
  return (
    <div
      className="absolute bottom-[12.281%] contents left-[3.938%] right-[3.938%] top-[8.156%]"
      data-name="Group"
    >
      <Group49 />
    </div>
  );
}

function Group51() {
  return (
    <div
      className="absolute bottom-[12.281%] contents left-[3.938%] right-[3.938%] top-[8.156%]"
      data-name="Group"
    >
      <Group50 />
    </div>
  );
}

function Folder() {
  return (
    <div
      className="absolute left-4 overflow-clip size-4 top-[46px]"
      data-name="folder"
    >
      <Group51 />
    </div>
  );
}

function Group52() {
  return (
    <div
      className="absolute bottom-[20.688%] left-[33.25%] right-[33.251%] top-[20.689%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 6 10"
      >
        <g id="Group">
          <path
            d={svgPaths.p23098f80}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group53() {
  return (
    <div
      className="absolute bottom-[20.688%] contents left-[33.25%] right-[33.251%] top-[20.689%]"
      data-name="Group"
    >
      <Group52 />
    </div>
  );
}

function Group54() {
  return (
    <div
      className="absolute bottom-[20.688%] contents left-[33.25%] right-[33.251%] top-[20.689%]"
      data-name="Group"
    >
      <Group53 />
    </div>
  );
}

function ChevronRight() {
  return (
    <div
      className="absolute left-4 overflow-clip size-4 top-[74px]"
      data-name="chevron-right"
    >
      <Group54 />
    </div>
  );
}

function Group55() {
  return (
    <div
      className="absolute bottom-[12.281%] left-[3.938%] right-[3.938%] top-[8.156%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 13"
      >
        <g id="Group">
          <path
            d={svgPaths.p1a422c80}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group56() {
  return (
    <div
      className="absolute bottom-[12.281%] contents left-[3.938%] right-[3.938%] top-[8.156%]"
      data-name="Group"
    >
      <Group55 />
    </div>
  );
}

function Group57() {
  return (
    <div
      className="absolute bottom-[12.281%] contents left-[3.938%] right-[3.938%] top-[8.156%]"
      data-name="Group"
    >
      <Group56 />
    </div>
  );
}

function Folder1() {
  return (
    <div
      className="absolute left-10 overflow-clip size-4 top-[74px]"
      data-name="folder"
    >
      <Group57 />
    </div>
  );
}

function Group58() {
  return (
    <div
      className="absolute bottom-[20.688%] left-[33.25%] right-[33.251%] top-[20.689%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 6 10"
      >
        <g id="Group">
          <path
            d={svgPaths.p23098f80}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group59() {
  return (
    <div
      className="absolute bottom-[20.688%] contents left-[33.25%] right-[33.251%] top-[20.689%]"
      data-name="Group"
    >
      <Group58 />
    </div>
  );
}

function Group60() {
  return (
    <div
      className="absolute bottom-[20.688%] contents left-[33.25%] right-[33.251%] top-[20.689%]"
      data-name="Group"
    >
      <Group59 />
    </div>
  );
}

function ChevronRight1() {
  return (
    <div
      className="absolute left-2 overflow-clip size-4 top-1.5"
      data-name="chevron-right"
    >
      <Group60 />
    </div>
  );
}

function Group61() {
  return (
    <div
      className="absolute bottom-[12.281%] left-[3.938%] right-[3.938%] top-[8.156%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 13"
      >
        <g id="Group">
          <path
            d={svgPaths.p1a422c80}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group62() {
  return (
    <div
      className="absolute bottom-[12.281%] contents left-[3.938%] right-[3.938%] top-[8.156%]"
      data-name="Group"
    >
      <Group61 />
    </div>
  );
}

function Group63() {
  return (
    <div
      className="absolute bottom-[12.281%] contents left-[3.938%] right-[3.938%] top-[8.156%]"
      data-name="Group"
    >
      <Group62 />
    </div>
  );
}

function Folder2() {
  return (
    <div
      className="absolute left-8 overflow-clip size-4 top-1.5"
      data-name="folder"
    >
      <Group63 />
    </div>
  );
}

function Container1() {
  return (
    <div
      className="absolute bg-gray-600 h-7 left-4 rounded-md top-[100px] w-[247px]"
      data-name="Container"
    >
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-md" />
      <ChevronRight1 />
      <Folder2 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-14 not-italic text-[#ffffff] text-[14px] text-left text-nowrap top-1">
        <p className="block leading-[20px] whitespace-pre">Key Scenes</p>
      </div>
    </div>
  );
}

function Group64() {
  return (
    <div
      className="absolute bottom-[20.688%] left-[33.25%] right-[33.251%] top-[20.689%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 6 10"
      >
        <g id="Group">
          <path
            d={svgPaths.p23098f80}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group65() {
  return (
    <div
      className="absolute bottom-[20.688%] contents left-[33.25%] right-[33.251%] top-[20.689%]"
      data-name="Group"
    >
      <Group64 />
    </div>
  );
}

function Group66() {
  return (
    <div
      className="absolute bottom-[20.688%] contents left-[33.25%] right-[33.251%] top-[20.689%]"
      data-name="Group"
    >
      <Group65 />
    </div>
  );
}

function ChevronRight2() {
  return (
    <div
      className="absolute left-4 overflow-clip size-4 top-[138px]"
      data-name="chevron-right"
    >
      <Group66 />
    </div>
  );
}

function Group67() {
  return (
    <div
      className="absolute bottom-[12.281%] left-[3.938%] right-[3.938%] top-[8.156%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 13"
      >
        <g id="Group">
          <path
            d={svgPaths.p1a422c80}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group68() {
  return (
    <div
      className="absolute bottom-[12.281%] contents left-[3.938%] right-[3.938%] top-[8.156%]"
      data-name="Group"
    >
      <Group67 />
    </div>
  );
}

function Group69() {
  return (
    <div
      className="absolute bottom-[12.281%] contents left-[3.938%] right-[3.938%] top-[8.156%]"
      data-name="Group"
    >
      <Group68 />
    </div>
  );
}

function Folder3() {
  return (
    <div
      className="absolute left-10 overflow-clip size-4 top-[138px]"
      data-name="folder"
    >
      <Group69 />
    </div>
  );
}

function Group70() {
  return (
    <div
      className="absolute bottom-[20.688%] left-[33.25%] right-[33.251%] top-[20.689%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 6 10"
      >
        <g id="Group">
          <path
            d={svgPaths.p23098f80}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group71() {
  return (
    <div
      className="absolute bottom-[20.688%] contents left-[33.25%] right-[33.251%] top-[20.689%]"
      data-name="Group"
    >
      <Group70 />
    </div>
  );
}

function Group72() {
  return (
    <div
      className="absolute bottom-[20.688%] contents left-[33.25%] right-[33.251%] top-[20.689%]"
      data-name="Group"
    >
      <Group71 />
    </div>
  );
}

function ChevronRight3() {
  return (
    <div
      className="absolute left-4 overflow-clip size-4 top-[166px]"
      data-name="chevron-right"
    >
      <Group72 />
    </div>
  );
}

function Group73() {
  return (
    <div
      className="absolute bottom-[12.281%] left-[3.938%] right-[3.938%] top-[8.156%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 13"
      >
        <g id="Group">
          <path
            d={svgPaths.p1a422c80}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group74() {
  return (
    <div
      className="absolute bottom-[12.281%] contents left-[3.938%] right-[3.938%] top-[8.156%]"
      data-name="Group"
    >
      <Group73 />
    </div>
  );
}

function Group75() {
  return (
    <div
      className="absolute bottom-[12.281%] contents left-[3.938%] right-[3.938%] top-[8.156%]"
      data-name="Group"
    >
      <Group74 />
    </div>
  );
}

function Folder4() {
  return (
    <div
      className="absolute left-10 overflow-clip size-4 top-[166px]"
      data-name="folder"
    >
      <Group75 />
    </div>
  );
}

function Group76() {
  return (
    <div
      className="absolute bottom-[45.813%] left-[16.5%] right-[16.5%] top-[45.813%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11 2"
      >
        <g id="Group">
          <path
            d={svgPaths.p2e925080}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group77() {
  return (
    <div
      className="absolute bottom-[16.5%] left-[45.813%] right-[45.813%] top-[16.5%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 2 11"
      >
        <g id="Group">
          <path
            d={svgPaths.p4d71480}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group78() {
  return (
    <div className="absolute contents inset-[16.5%]" data-name="Group">
      <Group76 />
      <Group77 />
    </div>
  );
}

function Group79() {
  return (
    <div className="absolute contents inset-[16.5%]" data-name="Group">
      <Group78 />
    </div>
  );
}

function Plus1() {
  return (
    <div
      className="absolute left-[247px] overflow-clip size-4 top-[210px]"
      data-name="plus"
    >
      <Group79 />
    </div>
  );
}

function Group80() {
  return (
    <div
      className="absolute bottom-[4.069%] left-[45.684%] right-[4.069%] top-[45.682%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 9 9"
      >
        <g id="Group">
          <path
            d={svgPaths.p11df5d00}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group81() {
  return (
    <div
      className="absolute bottom-[74.938%] left-[8.313%] right-[74.938%] top-[8.313%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 3 3"
      >
        <g id="Group">
          <path
            d={svgPaths.p743f180}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group82() {
  return (
    <div
      className="absolute bottom-[74.938%] left-[74.938%] right-[8.313%] top-[8.313%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 3 3"
      >
        <g id="Group">
          <path
            d={svgPaths.p38b18a80}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group83() {
  return (
    <div
      className="absolute bottom-[8.313%] left-[8.313%] right-[74.938%] top-[74.938%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 3 3"
      >
        <g id="Group">
          <path
            d={svgPaths.p3b656c70}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group84() {
  return (
    <div
      className="absolute bottom-[83.313%] left-[33.281%] right-[54.156%] top-[8.313%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 2 2"
      >
        <g id="Group">
          <path
            d={svgPaths.p1d49e100}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group85() {
  return (
    <div
      className="absolute bottom-[8.313%] left-[33.313%] right-[49.938%] top-[83.313%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 3 2"
      >
        <g id="Group">
          <path
            d={svgPaths.p1030c800}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group86() {
  return (
    <div
      className="absolute bottom-[83.313%] left-[54.156%] right-[33.281%] top-[8.313%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 2 2"
      >
        <g id="Group">
          <path
            d={svgPaths.p2e1f9b00}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group87() {
  return (
    <div
      className="absolute bottom-[54.156%] left-[8.313%] right-[83.313%] top-[33.281%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 2 2"
      >
        <g id="Group">
          <path
            d={svgPaths.p23eb1f80}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group88() {
  return (
    <div
      className="absolute bottom-[49.938%] left-[83.313%] right-[8.313%] top-[33.313%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 2 3"
      >
        <g id="Group">
          <path
            d={svgPaths.pb7a7180}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group89() {
  return (
    <div
      className="absolute bottom-[33.281%] left-[8.313%] right-[83.313%] top-[54.156%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 2 2"
      >
        <g id="Group">
          <path
            d={svgPaths.p19c37b80}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group90() {
  return (
    <div
      className="absolute bottom-[4.069%] contents left-[8.313%] right-[4.063%] top-[8.313%]"
      data-name="Group"
    >
      <Group80 />
      <Group81 />
      <Group82 />
      <Group83 />
      <Group84 />
      <Group85 />
      <Group86 />
      <Group87 />
      <Group88 />
      <Group89 />
    </div>
  );
}

function Group91() {
  return (
    <div
      className="absolute bottom-[4.069%] contents left-[8.313%] right-[4.063%] top-[8.313%]"
      data-name="Group"
    >
      <Group90 />
    </div>
  );
}

function SquareDashedMousePointer() {
  return (
    <div
      className="absolute left-4 overflow-clip size-4 top-[238px]"
      data-name="square-dashed-mouse-pointer"
    >
      <Group91 />
    </div>
  );
}

function Group92() {
  return (
    <div
      className="absolute bottom-[12.313%] left-[20.688%] right-[20.688%] top-[12.313%]"
      data-name="Group"
    >
      <div className="absolute bottom-[-5.556%] left-[-7.143%] right-[-7.143%] top-[-5.556%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 12 14"
        >
          <g id="Group">
            <path
              d="M1 1L10.38 7.03L1 13.06V1Z"
              id="Vector"
              stroke="var(--stroke-0, #A0A3B5)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.34"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group93() {
  return (
    <div
      className="absolute bottom-[12.313%] contents left-[20.688%] right-[20.688%] top-[12.313%]"
      data-name="Group"
    >
      <Group92 />
    </div>
  );
}

function Group94() {
  return (
    <div
      className="absolute bottom-[12.313%] contents left-[20.688%] right-[20.688%] top-[12.313%]"
      data-name="Group"
    >
      <Group93 />
    </div>
  );
}

function Image2() {
  return (
    <div className="absolute left-4 size-4 top-[266px]" data-name="Image">
      <div className="overflow-clip relative size-4">
        <Group94 />
      </div>
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Group95() {
  return (
    <div className="absolute inset-[8.125%]" data-name="Group">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 14 14"
      >
        <g id="Group">
          <path
            d={svgPaths.p1b8e4c50}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group96() {
  return (
    <div
      className="absolute bottom-[49.938%] left-[24.938%] right-[49.938%] top-[24.938%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 5 5"
      >
        <g id="Group">
          <path
            d={svgPaths.pd2cf080}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group97() {
  return (
    <div
      className="absolute bottom-[8.17%] left-[20.657%] right-[8.157%] top-[42.955%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 12 8"
      >
        <g id="Group">
          <path
            d={svgPaths.p20e02b00}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group98() {
  return (
    <div className="absolute contents inset-[8.125%]" data-name="Group">
      <Group95 />
      <Group96 />
      <Group97 />
    </div>
  );
}

function Group99() {
  return (
    <div className="absolute contents inset-[8.125%]" data-name="Group">
      <Group98 />
    </div>
  );
}

function Image3() {
  return (
    <div
      className="absolute left-4 overflow-clip size-4 top-[294px]"
      data-name="image"
    >
      <Group99 />
    </div>
  );
}

function Group100() {
  return (
    <div
      className="absolute bottom-[33.156%] left-[33.25%] right-[33.25%] top-[4.031%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 6 11"
      >
        <g id="Group">
          <path
            d={svgPaths.p3becc780}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group101() {
  return (
    <div
      className="absolute bottom-[16.531%] left-[16.5%] right-[16.5%] top-[37.406%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11 8"
      >
        <g id="Group">
          <path
            d={svgPaths.p2ccd4e40}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group102() {
  return (
    <div
      className="absolute bottom-[4.094%] left-[45.813%] right-[45.813%] top-[74.969%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 2 4"
      >
        <g id="Group">
          <path
            d={svgPaths.p1ed41b80}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group103() {
  return (
    <div
      className="absolute bottom-[4.094%] contents left-[16.5%] right-[16.5%] top-[4.031%]"
      data-name="Group"
    >
      <Group100 />
      <Group101 />
      <Group102 />
    </div>
  );
}

function Group104() {
  return (
    <div
      className="absolute bottom-[4.094%] contents left-[16.5%] right-[16.5%] top-[4.031%]"
      data-name="Group"
    >
      <Group103 />
    </div>
  );
}

function Mic() {
  return (
    <div
      className="absolute left-4 overflow-clip size-4 top-[322px]"
      data-name="mic"
    >
      <Group104 />
    </div>
  );
}

function Group105() {
  return (
    <div
      className="absolute bottom-[3.968%] left-[3.968%] right-[8.061%] top-[8.061%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 15"
      >
        <g id="Group">
          <path
            d={svgPaths.p152f7780}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group106() {
  return (
    <div
      className="absolute bottom-[3.968%] contents left-[3.968%] right-[8.061%] top-[8.061%]"
      data-name="Group"
    >
      <Group105 />
    </div>
  );
}

function Group107() {
  return (
    <div
      className="absolute bottom-[3.968%] contents left-[3.968%] right-[8.061%] top-[8.061%]"
      data-name="Group"
    >
      <Group106 />
    </div>
  );
}

function MessageCircle() {
  return (
    <div
      className="absolute left-4 overflow-clip size-4 top-[350px]"
      data-name="message-circle"
    >
      <Group107 />
    </div>
  );
}

function Group108() {
  return (
    <div
      className="absolute bottom-[62.469%] left-[8.313%] right-[74.938%] top-[16.594%]"
      data-name="Group"
    >
      <div className="absolute bottom-[-20%] left-[-25%] right-[-25%] top-[-20%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 5 6"
        >
          <g id="Group">
            <path
              d={svgPaths.p20aff580}
              id="Vector"
              stroke="var(--stroke-0, #A0A3B5)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.34"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group109() {
  return (
    <div
      className="absolute bottom-[62.469%] left-[74.938%] right-[8.313%] top-[16.594%]"
      data-name="Group"
    >
      <div className="absolute bottom-[-20%] left-[-25%] right-[-25%] top-[-20%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 5 6"
        >
          <g id="Group">
            <path
              d={svgPaths.p1edce400}
              id="Vector"
              stroke="var(--stroke-0, #A0A3B5)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.34"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group110() {
  return (
    <div
      className="absolute bottom-[8.313%] left-[18.594%] right-[18.594%] top-[91.688%]"
      data-name="Group"
    >
      <div className="absolute bottom-[-0.67px] left-[-6.667%] right-[-6.667%] top-[-0.67px]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 12 2"
        >
          <g id="Group">
            <path
              d="M1 1H11.05"
              id="Vector"
              stroke="var(--stroke-0, #A0A3B5)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.34"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group111() {
  return (
    <div
      className="absolute bottom-[8.281%] left-1/2 right-1/2 top-[70.781%]"
      data-name="Group"
    >
      <div className="absolute bottom-[-20%] left-[-0.67px] right-[-0.67px] top-[-20%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 2 6"
        >
          <g id="Group">
            <path
              d="M1 1V4.35"
              id="Vector"
              stroke="var(--stroke-0, #A0A3B5)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.34"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group112() {
  return (
    <div
      className="absolute bottom-[54.188%] left-[8.125%] right-[8.125%] top-[45.813%]"
      data-name="Group"
    >
      <div className="absolute bottom-[-0.67px] left-[-5%] right-[-5%] top-[-0.67px]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 16 2"
        >
          <g id="Group">
            <path
              d="M1 1H14.4"
              id="Vector"
              stroke="var(--stroke-0, #A0A3B5)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.34"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group113() {
  return (
    <div
      className="absolute bottom-[29.031%] left-[8.25%] right-[49.875%] top-[8.156%]"
      data-name="Group"
    >
      <div className="absolute bottom-[-6.667%] left-[-10%] right-[-10%] top-[-6.667%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 9 12"
        >
          <g id="Group">
            <path
              d={svgPaths.p3f86caf0}
              id="Vector"
              stroke="var(--stroke-0, #A0A3B5)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.34"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group114() {
  return (
    <div
      className="absolute bottom-[29.031%] left-[49.875%] right-[-0.125%] top-[8.156%]"
      data-name="Group"
    >
      <div className="absolute bottom-[-6.667%] left-[-8.334%] right-[-8.333%] top-[-6.667%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 10 12"
        >
          <g id="Group">
            <path
              d={svgPaths.p328c7980}
              id="Vector"
              stroke="var(--stroke-0, #A0A3B5)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.34"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group115() {
  return (
    <div
      className="absolute bottom-[8.281%] contents left-[8.125%] right-[-0.123%] top-[8.156%]"
      data-name="Group"
    >
      <Group108 />
      <Group109 />
      <Group110 />
      <Group111 />
      <Group112 />
      <Group113 />
      <Group114 />
    </div>
  );
}

function Group116() {
  return (
    <div
      className="absolute bottom-[8.281%] contents left-[8.125%] right-[-0.123%] top-[8.156%]"
      data-name="Group"
    >
      <Group115 />
    </div>
  );
}

function Group117() {
  return (
    <div
      className="absolute bottom-[8.281%] contents left-[8.125%] right-[-0.123%] top-[8.156%]"
      data-name="Group"
    >
      <Group116 />
    </div>
  );
}

function Group118() {
  return (
    <div
      className="absolute bottom-[8.281%] contents left-[8.125%] right-[-0.123%] top-[8.156%]"
      data-name="Group"
    >
      <Group117 />
    </div>
  );
}

function Image4() {
  return (
    <div className="absolute left-4 size-4 top-[378px]" data-name="Image">
      <div className="overflow-clip relative size-4">
        <Group118 />
      </div>
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Group119() {
  return (
    <div
      className="absolute bottom-[45.813%] left-[16.5%] right-[16.5%] top-[45.813%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11 2"
      >
        <g id="Group">
          <path
            d={svgPaths.p2e925080}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group120() {
  return (
    <div
      className="absolute bottom-[16.5%] left-[45.813%] right-[45.813%] top-[16.5%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 2 11"
      >
        <g id="Group">
          <path
            d={svgPaths.p4d71480}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group121() {
  return (
    <div className="absolute contents inset-[16.5%]" data-name="Group">
      <Group119 />
      <Group120 />
    </div>
  );
}

function Group122() {
  return (
    <div className="absolute contents inset-[16.5%]" data-name="Group">
      <Group121 />
    </div>
  );
}

function Plus2() {
  return (
    <div
      className="absolute left-4 overflow-clip size-4 top-[406px]"
      data-name="plus"
    >
      <Group122 />
    </div>
  );
}

function Group123() {
  return (
    <div
      className="absolute bottom-[45.813%] left-[16.5%] right-[16.5%] top-[45.813%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11 2"
      >
        <g id="Group">
          <path
            d={svgPaths.p2e925080}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group124() {
  return (
    <div
      className="absolute bottom-[16.5%] left-[45.813%] right-[45.813%] top-[16.5%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 2 11"
      >
        <g id="Group">
          <path
            d={svgPaths.p4d71480}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group125() {
  return (
    <div className="absolute contents inset-[16.5%]" data-name="Group">
      <Group123 />
      <Group124 />
    </div>
  );
}

function Group126() {
  return (
    <div className="absolute contents inset-[16.5%]" data-name="Group">
      <Group125 />
    </div>
  );
}

function Plus3() {
  return (
    <div
      className="absolute left-[247px] overflow-clip size-4 top-[450px]"
      data-name="plus"
    >
      <Group126 />
    </div>
  );
}

function Group127() {
  return (
    <div
      className="absolute bottom-3/4 left-[33.219%] right-[12.344%] top-1/4"
      data-name="Group"
    >
      <div className="absolute bottom-[-0.67px] left-[-7.692%] right-[-7.692%] top-[-0.67px]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 11 2"
        >
          <g id="Group">
            <path
              d="M1 1H9.71"
              id="Vector"
              stroke="var(--stroke-0, #A0A3B5)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.34"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group128() {
  return (
    <div
      className="absolute bottom-1/2 left-[33.219%] right-[12.344%] top-1/2"
      data-name="Group"
    >
      <div className="absolute bottom-[-0.67px] left-[-7.692%] right-[-7.692%] top-[-0.67px]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 11 2"
        >
          <g id="Group">
            <path
              d="M1 1H9.71"
              id="Vector"
              stroke="var(--stroke-0, #A0A3B5)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.34"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group129() {
  return (
    <div
      className="absolute bottom-1/4 left-[33.219%] right-[12.344%] top-3/4"
      data-name="Group"
    >
      <div className="absolute bottom-[-0.67px] left-[-7.692%] right-[-7.692%] top-[-0.67px]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 11 2"
        >
          <g id="Group">
            <path
              d="M1 1H9.71"
              id="Vector"
              stroke="var(--stroke-0, #A0A3B5)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.34"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group130() {
  return (
    <div
      className="absolute bottom-3/4 left-[12.479%] right-[87.479%] top-1/4"
      data-name="Group"
    >
      <div className="absolute inset-[-0.67px]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 2 2"
        >
          <g id="Group">
            <path
              d="M1 1H1.0067"
              id="Vector"
              stroke="var(--stroke-0, #A0A3B5)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.34"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group131() {
  return (
    <div
      className="absolute bottom-1/2 left-[12.479%] right-[87.479%] top-1/2"
      data-name="Group"
    >
      <div className="absolute inset-[-0.67px]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 2 2"
        >
          <g id="Group">
            <path
              d="M1 1H1.0067"
              id="Vector"
              stroke="var(--stroke-0, #A0A3B5)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.34"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group132() {
  return (
    <div
      className="absolute bottom-1/4 left-[12.479%] right-[87.479%] top-3/4"
      data-name="Group"
    >
      <div className="absolute inset-[-0.67px]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 2 2"
        >
          <g id="Group">
            <path
              d="M1 1H1.0067"
              id="Vector"
              stroke="var(--stroke-0, #A0A3B5)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.34"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group133() {
  return (
    <div
      className="absolute bottom-1/4 contents left-[12.479%] right-[12.344%] top-1/4"
      data-name="Group"
    >
      <Group127 />
      <Group128 />
      <Group129 />
      <Group130 />
      <Group131 />
      <Group132 />
    </div>
  );
}

function Group134() {
  return (
    <div
      className="absolute bottom-1/4 contents left-[12.479%] right-[12.344%] top-1/4"
      data-name="Group"
    >
      <Group133 />
    </div>
  );
}

function Group135() {
  return (
    <div
      className="absolute bottom-1/4 contents left-[12.479%] right-[12.344%] top-1/4"
      data-name="Group"
    >
      <Group134 />
    </div>
  );
}

function Group136() {
  return (
    <div
      className="absolute bottom-1/4 contents left-[12.479%] right-[12.344%] top-1/4"
      data-name="Group"
    >
      <Group135 />
    </div>
  );
}

function Image5() {
  return (
    <div className="absolute left-4 size-4 top-[478px]" data-name="Image">
      <div className="overflow-clip relative size-4">
        <Group136 />
      </div>
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Group137() {
  return (
    <div
      className="absolute bottom-[4.063%] left-[12.313%] right-[12.313%] top-[45.688%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 13 9"
      >
        <g id="Group">
          <path
            d={svgPaths.p287cfc0}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group138() {
  return (
    <div
      className="absolute bottom-[70.75%] left-[29.063%] right-[29.064%] top-[4.126%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 7 5"
      >
        <g id="Group">
          <path
            d={svgPaths.p1a0ca00}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group139() {
  return (
    <div
      className="absolute bottom-[33.156%] left-[45.813%] right-[45.813%] top-[4.031%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 2 11"
      >
        <g id="Group">
          <path
            d={svgPaths.p3bbfd480}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group140() {
  return (
    <div
      className="absolute bottom-[4.063%] contents left-[12.313%] right-[12.313%] top-[4.031%]"
      data-name="Group"
    >
      <Group137 />
      <Group138 />
      <Group139 />
    </div>
  );
}

function Group141() {
  return (
    <div
      className="absolute bottom-[4.063%] contents left-[12.313%] right-[12.313%] top-[4.031%]"
      data-name="Group"
    >
      <Group140 />
    </div>
  );
}

function Share() {
  return (
    <div
      className="absolute left-4 overflow-clip size-4 top-[506px]"
      data-name="share"
    >
      <Group141 />
    </div>
  );
}

function Group142() {
  return (
    <div
      className="absolute bottom-[4.063%] left-[12.313%] right-[12.313%] top-[45.688%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 13 9"
      >
        <g id="Group">
          <path
            d={svgPaths.p287cfc0}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group143() {
  return (
    <div
      className="absolute bottom-[70.75%] left-[29.063%] right-[29.064%] top-[4.126%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 7 5"
      >
        <g id="Group">
          <path
            d={svgPaths.p1a0ca00}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group144() {
  return (
    <div
      className="absolute bottom-[33.156%] left-[45.813%] right-[45.813%] top-[4.031%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 2 11"
      >
        <g id="Group">
          <path
            d={svgPaths.p3bbfd480}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group145() {
  return (
    <div
      className="absolute bottom-[4.063%] contents left-[12.313%] right-[12.313%] top-[4.031%]"
      data-name="Group"
    >
      <Group142 />
      <Group143 />
      <Group144 />
    </div>
  );
}

function Group146() {
  return (
    <div
      className="absolute bottom-[4.063%] contents left-[12.313%] right-[12.313%] top-[4.031%]"
      data-name="Group"
    >
      <Group145 />
    </div>
  );
}

function Share1() {
  return (
    <div
      className="absolute left-4 overflow-clip size-4 top-[534px]"
      data-name="share"
    >
      <Group146 />
    </div>
  );
}

function Group147() {
  return (
    <div
      className="absolute bottom-[45.813%] left-[16.5%] right-[16.5%] top-[45.813%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11 2"
      >
        <g id="Group">
          <path
            d={svgPaths.p2e925080}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group148() {
  return (
    <div
      className="absolute bottom-[16.5%] left-[45.813%] right-[45.813%] top-[16.5%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 2 11"
      >
        <g id="Group">
          <path
            d={svgPaths.p4d71480}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group149() {
  return (
    <div className="absolute contents inset-[16.5%]" data-name="Group">
      <Group147 />
      <Group148 />
    </div>
  );
}

function Group150() {
  return (
    <div className="absolute contents inset-[16.5%]" data-name="Group">
      <Group149 />
    </div>
  );
}

function Plus4() {
  return (
    <div
      className="absolute left-4 overflow-clip size-4 top-[562px]"
      data-name="plus"
    >
      <Group150 />
    </div>
  );
}

function Group151() {
  return (
    <div
      className="absolute bottom-[16.5%] left-[3.947%] right-[3.938%] top-[16.501%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 11"
      >
        <g id="Group">
          <path
            d={svgPaths.p125b9680}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group152() {
  return (
    <div
      className="absolute bottom-[16.5%] contents left-[3.947%] right-[3.938%] top-[16.501%]"
      data-name="Group"
    >
      <Group151 />
    </div>
  );
}

function Group153() {
  return (
    <div
      className="absolute bottom-[16.5%] contents left-[3.947%] right-[3.938%] top-[16.501%]"
      data-name="Group"
    >
      <Group152 />
    </div>
  );
}

function Cloud() {
  return (
    <div
      className="absolute left-4 overflow-clip size-4 top-[606px]"
      data-name="cloud"
    >
      <Group153 />
    </div>
  );
}

function Container2() {
  return (
    <div
      className="absolute bg-[#292b36] h-[780px] left-0 top-0 w-[280px]"
      data-name="Container"
    >
      <div className="h-[780px] overflow-clip relative w-[280px]">
        <div
          className="absolute h-[780px] left-[280px] top-0 w-0"
          data-name="Line"
        >
          <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 2 780"
            >
              <path d="M1 0V780" id="Line" stroke="var(--stroke-0, #373A4B)" />
            </svg>
          </div>
        </div>
        <Plus />
        <div className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[0] left-4 not-italic text-[#ffffff] text-[14px] text-left text-nowrap top-4">
          <p className="block leading-[20px] whitespace-pre">Assets</p>
        </div>
        <Folder />
        <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-10 not-italic text-[#a0a3b5] text-[14px] text-left text-nowrap top-11">
          <p className="block leading-[20px] whitespace-pre">All Assets</p>
        </div>
        <ChevronRight />
        <Folder1 />
        <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-16 not-italic text-[#a0a3b5] text-[14px] text-left text-nowrap top-[72px]">
          <p className="block leading-[20px] whitespace-pre">Episodes</p>
        </div>
        <Container1 />
        <ChevronRight2 />
        <Folder3 />
        <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-16 not-italic text-[#a0a3b5] text-[14px] text-left text-nowrap top-[136px]">
          <p className="block leading-[20px] whitespace-pre">Talent</p>
        </div>
        <ChevronRight3 />
        <Folder4 />
        <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-16 not-italic text-[#a0a3b5] text-[14px] text-left text-nowrap top-[164px]">
          <p className="block leading-[20px] whitespace-pre">Location</p>
        </div>
        <Plus1 />
        <div className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[0] left-4 not-italic text-[#ffffff] text-[14px] text-left text-nowrap top-52">
          <p className="block leading-[20px] whitespace-pre">Collections</p>
        </div>
        <SquareDashedMousePointer />
        <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-10 not-italic text-[#a0a3b5] text-[14px] text-left text-nowrap top-[236px]">
          <p className="block leading-[20px] whitespace-pre">
            Needs Retouching
          </p>
        </div>
        <Image2 />
        <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-10 not-italic text-[#a0a3b5] text-[14px] text-left text-nowrap top-[264px]">
          <p className="block leading-[20px] whitespace-pre">Videos</p>
        </div>
        <Image3 />
        <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-10 not-italic text-[#a0a3b5] text-[14px] text-left text-nowrap top-[292px]">
          <p className="block leading-[20px] whitespace-pre">Images</p>
        </div>
        <Mic />
        <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-10 not-italic text-[#a0a3b5] text-[14px] text-left text-nowrap top-80">
          <p className="block leading-[20px] whitespace-pre">Audio</p>
        </div>
        <MessageCircle />
        <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-10 not-italic text-[#a0a3b5] text-[14px] text-left text-nowrap top-[348px]">
          <p className="block leading-[20px] whitespace-pre">Needs Review</p>
        </div>
        <Image4 />
        <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-10 not-italic text-[#a0a3b5] text-[14px] text-left text-nowrap top-[376px]">
          <p className="block leading-[20px] whitespace-pre">Approved</p>
        </div>
        <Plus2 />
        <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-10 not-italic text-[#a0a3b5] text-[14px] text-left text-nowrap top-[404px]">
          <p className="block leading-[20px] whitespace-pre">New Collection</p>
        </div>
        <Plus3 />
        <div className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[0] left-4 not-italic text-[#ffffff] text-[14px] text-left text-nowrap top-[448px]">
          <p className="block leading-[20px] whitespace-pre">Shares</p>
        </div>
        <Image5 />
        <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-10 not-italic text-[#a0a3b5] text-[14px] text-left text-nowrap top-[476px]">
          <p className="block leading-[20px] whitespace-pre">All Shares (2)</p>
        </div>
        <Share />
        <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-10 not-italic text-[#a0a3b5] text-[14px] text-left text-nowrap top-[504px]">
          <p className="block leading-[20px] whitespace-pre">
            Rough Cut 10/14/24
          </p>
        </div>
        <Share1 />
        <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-10 not-italic text-[#a0a3b5] text-[14px] text-left text-nowrap top-[532px]">
          <p className="block leading-[20px] whitespace-pre">Trailer v2</p>
        </div>
        <Plus4 />
        <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-10 not-italic text-[#a0a3b5] text-[14px] text-left text-nowrap top-[560px]">
          <p className="block leading-[20px] whitespace-pre">New Share</p>
        </div>
        <Cloud />
        <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-10 not-italic text-[#a0a3b5] text-[14px] text-left text-nowrap top-[604px]">
          <p className="block leading-[20px] whitespace-pre">C2C Connections</p>
        </div>
      </div>
      <div className="absolute border-0 border-[#373a4b] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Group154() {
  return (
    <div
      className="absolute bottom-[54.094%] left-[8.219%] right-[54.094%] top-[8.219%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 7 7"
      >
        <g id="Group">
          <path
            d={svgPaths.p2db5a300}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group155() {
  return (
    <div
      className="absolute bottom-[54.094%] left-[54.094%] right-[8.219%] top-[8.219%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 7 7"
      >
        <g id="Group">
          <path
            d={svgPaths.p165fee80}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group156() {
  return (
    <div
      className="absolute bottom-[8.219%] left-[54.094%] right-[8.219%] top-[54.094%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 7 7"
      >
        <g id="Group">
          <path
            d={svgPaths.p2b9ceab0}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group157() {
  return (
    <div
      className="absolute bottom-[8.219%] left-[8.219%] right-[54.094%] top-[54.094%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 7 7"
      >
        <g id="Group">
          <path
            d={svgPaths.p3dddbe00}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group158() {
  return (
    <div className="absolute contents inset-[8.219%]" data-name="Group">
      <Group154 />
      <Group155 />
      <Group156 />
      <Group157 />
    </div>
  );
}

function Group159() {
  return (
    <div className="absolute contents inset-[8.219%]" data-name="Group">
      <Group158 />
    </div>
  );
}

function LayoutGrid1() {
  return (
    <div
      className="absolute left-6 overflow-clip size-4 top-[31px]"
      data-name="layout-grid"
    >
      <Group159 />
    </div>
  );
}

function Group160() {
  return (
    <div
      className="absolute bottom-[7.834%] left-[3.93%] right-[3.938%] top-[3.927%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 15"
      >
        <g id="Group">
          <path
            d={svgPaths.p30b89c00}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group161() {
  return (
    <div
      className="absolute bottom-[7.834%] contents left-[3.93%] right-[3.938%] top-[3.927%]"
      data-name="Group"
    >
      <Group160 />
    </div>
  );
}

function Group162() {
  return (
    <div
      className="absolute bottom-[7.834%] contents left-[3.93%] right-[3.938%] top-[3.927%]"
      data-name="Group"
    >
      <Group161 />
    </div>
  );
}

function Star1() {
  return (
    <div
      className="absolute left-[142px] overflow-clip size-4 top-[31px]"
      data-name="star"
    >
      <Group162 />
    </div>
  );
}

function Group163() {
  return (
    <div
      className="absolute bottom-[12.313%] left-[8.125%] right-[8.125%] top-[12.313%]"
      data-name="Group"
    >
      <div className="absolute bottom-[-5.556%] left-[-5%] right-[-5%] top-[-5.556%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 16 14"
        >
          <g id="Group">
            <path
              d={svgPaths.p234d2900}
              id="Vector"
              stroke="var(--stroke-0, white)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.34"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group164() {
  return (
    <div
      className="absolute bottom-[12.313%] contents left-[8.125%] right-[8.125%] top-[12.313%]"
      data-name="Group"
    >
      <Group163 />
    </div>
  );
}

function Group165() {
  return (
    <div
      className="absolute bottom-[12.313%] contents left-[8.125%] right-[8.125%] top-[12.313%]"
      data-name="Group"
    >
      <Group164 />
    </div>
  );
}

function Image6() {
  return (
    <div className="absolute left-[278px] size-4 top-[31px]" data-name="Image">
      <div className="overflow-clip relative size-4">
        <Group165 />
      </div>
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Group166() {
  return (
    <div
      className="absolute bottom-[8.288%] left-[65.164%] right-[8.288%] top-[65.164%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 5 5"
      >
        <g id="Group">
          <path
            d={svgPaths.p2c66bc80}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group167() {
  return (
    <div
      className="absolute bottom-[16.5%] left-[8.125%] right-[16.5%] top-[8.125%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 13 13"
      >
        <g id="Group">
          <path
            d={svgPaths.p283aa700}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group168() {
  return (
    <div
      className="absolute bottom-[8.288%] contents left-[8.125%] right-[8.29%] top-[8.125%]"
      data-name="Group"
    >
      <Group166 />
      <Group167 />
    </div>
  );
}

function Group169() {
  return (
    <div
      className="absolute bottom-[8.288%] contents left-[8.125%] right-[8.29%] top-[8.125%]"
      data-name="Group"
    >
      <Group168 />
    </div>
  );
}

function Search1() {
  return (
    <div
      className="absolute left-[694px] overflow-clip size-4 top-[31px]"
      data-name="search"
    >
      <Group169 />
    </div>
  );
}

function Textbox() {
  return (
    <div
      className="absolute bg-[#292b36] h-[29px] left-[726px] rounded-md top-6 w-[235px]"
      data-name="Textbox"
    >
      <div className="absolute border border-[#373a4b] border-solid inset-[-0.5px] pointer-events-none rounded-[6.5px]" />
      <div
        className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-3 not-italic right-20 text-[14px] text-gray-400 text-left text-nowrap"
        style={{ top: "calc(50% - 10.5px)" }}
      >
        <p className="block leading-[22px] whitespace-pre">
          Search in Key Scenes
        </p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div
      className="absolute bg-indigo-500 left-[1038px] rounded-[14px] size-7 top-[25px]"
      data-name="Container"
    >
      <div className="absolute border-2 border-[#1f2029] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[0] left-1.5 not-italic text-[#ffffff] text-[12px] text-left text-nowrap top-1.5">
        <p className="block leading-[16px] whitespace-pre">36</p>
      </div>
    </div>
  );
}

function Avatar() {
  return (
    <div
      className="absolute bg-[#ffffff] left-[978px] rounded-[14px] size-7 top-[25px]"
      data-name="Avatar"
    >
      <div className="overflow-clip relative size-7">
        <div
          className="[background-size:100%_100%] absolute bg-no-repeat bg-top-left inset-0"
          data-name="Rectangle"
          style={{ backgroundImage: `url('${imgRectangle}')` }}
        >
          <div className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none" />
        </div>
      </div>
      <div className="absolute border-0 border-[#dee1e6] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Avatar1() {
  return (
    <div
      className="absolute bg-[#ffffff] left-[998px] rounded-[14px] size-7 top-[25px]"
      data-name="Avatar"
    >
      <div className="overflow-clip relative size-7">
        <div
          className="[background-size:100%_100%] absolute bg-no-repeat bg-top-left inset-0"
          data-name="Rectangle"
          style={{ backgroundImage: `url('${imgRectangle1}')` }}
        >
          <div className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none" />
        </div>
      </div>
      <div className="absolute border-0 border-[#dee1e6] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Avatar2() {
  return (
    <div
      className="absolute bg-[#ffffff] left-[1018px] rounded-[14px] size-7 top-[25px]"
      data-name="Avatar"
    >
      <div className="overflow-clip relative size-7">
        <div
          className="[background-size:100%_100%] absolute bg-no-repeat bg-top-left inset-0"
          data-name="Rectangle"
          style={{ backgroundImage: `url('${imgRectangle1}')` }}
        >
          <div className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none" />
        </div>
      </div>
      <div className="absolute border-0 border-[#dee1e6] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Group170() {
  return (
    <div
      className="absolute bottom-[33.25%] left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 10 6"
      >
        <g id="Group">
          <path
            d={svgPaths.pee98f80}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group171() {
  return (
    <div
      className="absolute bottom-[33.25%] contents left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <Group170 />
    </div>
  );
}

function Group172() {
  return (
    <div
      className="absolute bottom-[33.25%] contents left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <Group171 />
    </div>
  );
}

function ChevronDown() {
  return (
    <div
      className="absolute left-6 overflow-clip size-4 top-20"
      data-name="chevron-down"
    >
      <Group172 />
    </div>
  );
}

function Group173() {
  return (
    <div
      className="absolute bottom-[33.25%] left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 10 6"
      >
        <g id="Group">
          <path
            d={svgPaths.pee98f80}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group174() {
  return (
    <div
      className="absolute bottom-[33.25%] contents left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <Group173 />
    </div>
  );
}

function Group175() {
  return (
    <div
      className="absolute bottom-[33.25%] contents left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <Group174 />
    </div>
  );
}

function ChevronDown1() {
  return (
    <div
      className="absolute left-[191px] overflow-clip size-4 top-[11px]"
      data-name="chevron-down"
    >
      <Group175 />
    </div>
  );
}

function Container4() {
  return (
    <div
      className="absolute bg-[#1f2029] h-[38px] left-[13px] rounded-md top-[257px] w-[217px]"
      data-name="Container"
    >
      <div className="absolute border border-gray-600 border-solid inset-0 pointer-events-none rounded-md" />
      <ChevronDown1 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[9px] not-italic text-[#ffffff] text-[14px] text-left text-nowrap top-[9px]">
        <p className="block leading-[20px] whitespace-pre">Role</p>
      </div>
    </div>
  );
}

function Group176() {
  return (
    <div
      className="absolute bottom-[25.125%] left-[12.651%] right-[12.65%] top-[20.925%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 11"
      >
        <g id="Group">
          <path
            d={svgPaths.p2f3fcb00}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group177() {
  return (
    <div
      className="absolute bottom-[25.125%] contents left-[12.651%] right-[12.65%] top-[20.925%]"
      data-name="Group"
    >
      <Group176 />
    </div>
  );
}

function Group178() {
  return (
    <div
      className="absolute bottom-[25.125%] contents left-[12.651%] right-[12.65%] top-[20.925%]"
      data-name="Group"
    >
      <Group177 />
    </div>
  );
}

function Check() {
  return (
    <div
      className="absolute left-[21px] overflow-clip size-5 top-[21px]"
      data-name="check"
    >
      <Group178 />
    </div>
  );
}

function Group179() {
  return (
    <div
      className="absolute bottom-[4.166%] left-[4.166%] right-[8.301%] top-[8.301%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11 11"
      >
        <g id="Group">
          <path
            d={svgPaths.p2d5c0100}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group180() {
  return (
    <div
      className="absolute bottom-[4.166%] contents left-[4.166%] right-[8.301%] top-[8.301%]"
      data-name="Group"
    >
      <Group179 />
    </div>
  );
}

function Group181() {
  return (
    <div
      className="absolute bottom-[4.166%] contents left-[4.166%] right-[8.301%] top-[8.301%]"
      data-name="Group"
    >
      <Group180 />
    </div>
  );
}

function MessageCircle1() {
  return (
    <div
      className="absolute left-2 overflow-clip size-3 top-1.5"
      data-name="message-circle"
    >
      <Group181 />
    </div>
  );
}

function Container5() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0.5)] h-6 left-[21px] rounded-xl top-[161px] w-10"
      data-name="Container"
    >
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-xl" />
      <MessageCircle1 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-6 not-italic text-[#ffffff] text-[12px] text-left text-nowrap top-1">
        <p className="block leading-[16px] whitespace-pre">2</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0.5)] h-6 left-[174px] rounded-md top-[161px] w-12"
      data-name="Container"
    >
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-md" />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-2 not-italic text-[#ffffff] text-[12px] text-left text-nowrap top-1">
        <p className="block leading-[16px] whitespace-pre">00:10</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div
      className="absolute bg-[#292b36] h-[340px] left-6 rounded-lg top-[122px] w-[243px]"
      data-name="Container"
    >
      <div className="absolute border border-gray-600 border-solid inset-0 pointer-events-none rounded-lg" />
      <div className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[0] left-[13px] not-italic text-[#ffffff] text-[14px] text-left text-nowrap top-[205px]">
        <p className="block leading-[20px] whitespace-pre">
          DRP_B004_081606_V1_0099.mov
        </p>
      </div>
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[13px] not-italic text-[#a0a3b5] text-[12px] text-left text-nowrap top-[229px]">
        <p className="block leading-[16px] whitespace-pre">
          Alissa Morris • Oct 14th, 2024
        </p>
      </div>
      <Container4 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[13px] not-italic text-[#a0a3b5] text-[12px] text-left text-nowrap top-[303px]">
        <p className="block leading-[16px] whitespace-pre">Select an option</p>
      </div>
      <div
        className="absolute bg-[#d9d9d9] h-[180px] left-[13px] rounded-md top-[13px] w-[216.5px]"
        data-name="Image"
      >
        <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-md" />
      </div>
      <Check />
      <Container5 />
      <Container6 />
    </div>
  );
}

function Group182() {
  return (
    <div
      className="absolute bottom-[33.25%] left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 10 6"
      >
        <g id="Group">
          <path
            d={svgPaths.pee98f80}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group183() {
  return (
    <div
      className="absolute bottom-[33.25%] contents left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <Group182 />
    </div>
  );
}

function Group184() {
  return (
    <div
      className="absolute bottom-[33.25%] contents left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <Group183 />
    </div>
  );
}

function ChevronDown2() {
  return (
    <div
      className="absolute left-[191px] overflow-clip size-4 top-[11px]"
      data-name="chevron-down"
    >
      <Group184 />
    </div>
  );
}

function Container8() {
  return (
    <div
      className="absolute bg-[#1f2029] h-[38px] left-[13px] rounded-md top-[257px] w-[217px]"
      data-name="Container"
    >
      <div className="absolute border border-gray-600 border-solid inset-0 pointer-events-none rounded-md" />
      <ChevronDown2 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[9px] not-italic text-[#ffffff] text-[14px] text-left text-nowrap top-[9px]">
        <p className="block leading-[20px] whitespace-pre">Role</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div
      className="absolute bg-[#5c4533] h-6 left-[13px] rounded-xl top-[303px] w-[65px]"
      data-name="Container"
    >
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-xl" />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-2 not-italic text-[#f3a533] text-[12px] text-left text-nowrap top-1">
        <p className="block leading-[16px] whitespace-pre">Coloring</p>
      </div>
    </div>
  );
}

function Group185() {
  return (
    <div
      className="absolute bottom-[4.166%] left-[4.166%] right-[8.301%] top-[8.301%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11 11"
      >
        <g id="Group">
          <path
            d={svgPaths.p2d5c0100}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group186() {
  return (
    <div
      className="absolute bottom-[4.166%] contents left-[4.166%] right-[8.301%] top-[8.301%]"
      data-name="Group"
    >
      <Group185 />
    </div>
  );
}

function Group187() {
  return (
    <div
      className="absolute bottom-[4.166%] contents left-[4.166%] right-[8.301%] top-[8.301%]"
      data-name="Group"
    >
      <Group186 />
    </div>
  );
}

function MessageCircle2() {
  return (
    <div
      className="absolute left-2 overflow-clip size-3 top-1.5"
      data-name="message-circle"
    >
      <Group187 />
    </div>
  );
}

function Container10() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0.5)] h-6 left-[21px] rounded-xl top-[161px] w-[37px]"
      data-name="Container"
    >
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-xl" />
      <MessageCircle2 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-6 not-italic text-[#ffffff] text-[12px] text-left text-nowrap top-1">
        <p className="block leading-[16px] whitespace-pre">1</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0.5)] h-6 left-[171px] rounded-md top-[161px] w-[50px]"
      data-name="Container"
    >
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-md" />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-2 not-italic text-[#ffffff] text-[12px] text-left text-nowrap top-1">
        <p className="block leading-[16px] whitespace-pre">00:30</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div
      className="absolute bg-[#292b36] h-[340px] left-[290px] rounded-lg top-[122px] w-[243px]"
      data-name="Container"
    >
      <div className="absolute border border-gray-600 border-solid inset-0 pointer-events-none rounded-lg" />
      <div className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[0] left-[13px] not-italic text-[#ffffff] text-[14px] text-left text-nowrap top-[205px]">
        <p className="block leading-[20px] whitespace-pre">
          DRP_A015_08150F_V1_0023.mov
        </p>
      </div>
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[13px] not-italic text-[#a0a3b5] text-[12px] text-left text-nowrap top-[229px]">
        <p className="block leading-[16px] whitespace-pre">
          Alissa Morris • Oct 14th, 2024
        </p>
      </div>
      <Container8 />
      <Container9 />
      <div
        className="absolute bg-[#d9d9d9] h-[180px] left-[13px] rounded-md top-[13px] w-[216.5px]"
        data-name="Image"
      >
        <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-md" />
      </div>
      <Container10 />
      <Container11 />
    </div>
  );
}

function Group188() {
  return (
    <div
      className="absolute bottom-[33.25%] left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 10 6"
      >
        <g id="Group">
          <path
            d={svgPaths.pee98f80}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group189() {
  return (
    <div
      className="absolute bottom-[33.25%] contents left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <Group188 />
    </div>
  );
}

function Group190() {
  return (
    <div
      className="absolute bottom-[33.25%] contents left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <Group189 />
    </div>
  );
}

function ChevronDown3() {
  return (
    <div
      className="absolute left-[191px] overflow-clip size-4 top-[11px]"
      data-name="chevron-down"
    >
      <Group190 />
    </div>
  );
}

function Container13() {
  return (
    <div
      className="absolute bg-[#1f2029] h-[38px] left-[13px] rounded-md top-[257px] w-[217px]"
      data-name="Container"
    >
      <div className="absolute border border-gray-600 border-solid inset-0 pointer-events-none rounded-md" />
      <ChevronDown3 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[9px] not-italic text-[#ffffff] text-[14px] text-left text-nowrap top-[9px]">
        <p className="block leading-[20px] whitespace-pre">Role</p>
      </div>
    </div>
  );
}

function Group191() {
  return (
    <div
      className="absolute bottom-[25.125%] left-[12.651%] right-[12.65%] top-[20.925%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 11"
      >
        <g id="Group">
          <path
            d={svgPaths.p2f3fcb00}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group192() {
  return (
    <div
      className="absolute bottom-[25.125%] contents left-[12.651%] right-[12.65%] top-[20.925%]"
      data-name="Group"
    >
      <Group191 />
    </div>
  );
}

function Group193() {
  return (
    <div
      className="absolute bottom-[25.125%] contents left-[12.651%] right-[12.65%] top-[20.925%]"
      data-name="Group"
    >
      <Group192 />
    </div>
  );
}

function Check1() {
  return (
    <div
      className="absolute left-[21px] overflow-clip size-5 top-[21px]"
      data-name="check"
    >
      <Group193 />
    </div>
  );
}

function Container14() {
  return (
    <div
      className="absolute bg-indigo-500 h-6 left-[189px] rounded-md top-[21px] w-8"
      data-name="Container"
    >
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-md" />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-2 not-italic text-[#ffffff] text-[12px] text-left text-nowrap top-1">
        <p className="block leading-[16px] whitespace-pre">V2</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0.5)] h-6 left-[172px] rounded-md top-[161px] w-[50px]"
      data-name="Container"
    >
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-md" />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-2 not-italic text-[#ffffff] text-[12px] text-left text-nowrap top-1">
        <p className="block leading-[16px] whitespace-pre">00:05</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div
      className="absolute bg-[#292b36] h-[340px] left-[557px] rounded-lg top-[122px] w-[243px]"
      data-name="Container"
    >
      <div className="absolute border border-indigo-500 border-solid inset-0 pointer-events-none rounded-lg" />
      <div className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[0] left-[13px] not-italic text-[#ffffff] text-[14px] text-left text-nowrap top-[205px]">
        <p className="block leading-[20px] whitespace-pre">
          DRP_B004_081606_V1_0099.mov
        </p>
      </div>
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[13px] not-italic text-[#a0a3b5] text-[12px] text-left text-nowrap top-[229px]">
        <p className="block leading-[16px] whitespace-pre">
          Alissa Morris • Oct 14th, 2024
        </p>
      </div>
      <Container13 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[13px] not-italic text-[#a0a3b5] text-[12px] text-left text-nowrap top-[303px]">
        <p className="block leading-[16px] whitespace-pre">Select an option</p>
      </div>
      <div
        className="absolute bg-[#d9d9d9] h-[180px] left-[13px] rounded-md top-[13px] w-[216.5px]"
        data-name="Image"
      >
        <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-md" />
      </div>
      <Check1 />
      <Container14 />
      <Container15 />
    </div>
  );
}

function Group194() {
  return (
    <div
      className="absolute bottom-[33.25%] left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 10 6"
      >
        <g id="Group">
          <path
            d={svgPaths.pee98f80}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group195() {
  return (
    <div
      className="absolute bottom-[33.25%] contents left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <Group194 />
    </div>
  );
}

function Group196() {
  return (
    <div
      className="absolute bottom-[33.25%] contents left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <Group195 />
    </div>
  );
}

function ChevronDown4() {
  return (
    <div
      className="absolute left-[191px] overflow-clip size-4 top-[11px]"
      data-name="chevron-down"
    >
      <Group196 />
    </div>
  );
}

function Container17() {
  return (
    <div
      className="absolute bg-[#1f2029] h-[38px] left-[13px] rounded-md top-[257px] w-[217px]"
      data-name="Container"
    >
      <div className="absolute border border-gray-600 border-solid inset-0 pointer-events-none rounded-md" />
      <ChevronDown4 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[9px] not-italic text-[#ffffff] text-[14px] text-left text-nowrap top-[9px]">
        <p className="block leading-[20px] whitespace-pre">Role</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div
      className="absolute bg-[#3b574f] h-6 left-[13px] rounded-xl top-[303px] w-[51px]"
      data-name="Container"
    >
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-xl" />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-2 not-italic text-[12px] text-emerald-300 text-left text-nowrap top-1">
        <p className="block leading-[16px] whitespace-pre">Social</p>
      </div>
    </div>
  );
}

function Group197() {
  return (
    <div
      className="absolute bottom-[4.166%] left-[4.166%] right-[8.301%] top-[8.301%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11 11"
      >
        <g id="Group">
          <path
            d={svgPaths.p2d5c0100}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group198() {
  return (
    <div
      className="absolute bottom-[4.166%] contents left-[4.166%] right-[8.301%] top-[8.301%]"
      data-name="Group"
    >
      <Group197 />
    </div>
  );
}

function Group199() {
  return (
    <div
      className="absolute bottom-[4.166%] contents left-[4.166%] right-[8.301%] top-[8.301%]"
      data-name="Group"
    >
      <Group198 />
    </div>
  );
}

function MessageCircle3() {
  return (
    <div
      className="absolute left-2 overflow-clip size-3 top-1.5"
      data-name="message-circle"
    >
      <Group199 />
    </div>
  );
}

function Container19() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0.5)] h-6 left-[21px] rounded-xl top-[161px] w-10"
      data-name="Container"
    >
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-xl" />
      <MessageCircle3 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-6 not-italic text-[#ffffff] text-[12px] text-left text-nowrap top-1">
        <p className="block leading-[16px] whitespace-pre">2</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0.5)] h-6 left-[171px] rounded-md top-[161px] w-[50px]"
      data-name="Container"
    >
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-md" />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-2 not-italic text-[#ffffff] text-[12px] text-left text-nowrap top-1">
        <p className="block leading-[16px] whitespace-pre">00:09</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div
      className="absolute bg-[#292b36] h-[340px] left-[823px] rounded-lg top-[122px] w-[243px]"
      data-name="Container"
    >
      <div className="absolute border border-gray-600 border-solid inset-0 pointer-events-none rounded-lg" />
      <div className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[0] left-[13px] not-italic text-[#ffffff] text-[14px] text-left text-nowrap top-[205px]">
        <p className="block leading-[20px] whitespace-pre">
          DRP_B005_0815SV_V1_0029.mov
        </p>
      </div>
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[13px] not-italic text-[#a0a3b5] text-[12px] text-left text-nowrap top-[229px]">
        <p className="block leading-[16px] whitespace-pre">
          Alissa Morris • Oct 14th, 2024
        </p>
      </div>
      <Container17 />
      <Container18 />
      <div
        className="absolute bg-[#d9d9d9] h-[180px] left-[13px] rounded-md top-[13px] w-[216.5px]"
        data-name="Image"
      >
        <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-md" />
      </div>
      <Container19 />
      <Container20 />
    </div>
  );
}

function Group200() {
  return (
    <div
      className="absolute bottom-[33.25%] left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 10 6"
      >
        <g id="Group">
          <path
            d={svgPaths.pee98f80}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group201() {
  return (
    <div
      className="absolute bottom-[33.25%] contents left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <Group200 />
    </div>
  );
}

function Group202() {
  return (
    <div
      className="absolute bottom-[33.25%] contents left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <Group201 />
    </div>
  );
}

function ChevronDown5() {
  return (
    <div
      className="absolute left-[191px] overflow-clip size-4 top-[11px]"
      data-name="chevron-down"
    >
      <Group202 />
    </div>
  );
}

function Container22() {
  return (
    <div
      className="absolute bg-[#1f2029] h-[38px] left-[13px] rounded-md top-[257px] w-[217px]"
      data-name="Container"
    >
      <div className="absolute border border-gray-600 border-solid inset-0 pointer-events-none rounded-md" />
      <ChevronDown5 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[9px] not-italic text-[#ffffff] text-[14px] text-left text-nowrap top-[9px]">
        <p className="block leading-[20px] whitespace-pre">Role</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div
      className="absolute bg-[#5c4533] h-6 left-[13px] rounded-xl top-[303px] w-20"
      data-name="Container"
    >
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-xl" />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-2 not-italic text-[#f3a533] text-[12px] text-left text-nowrap top-1">
        <p className="block leading-[16px] whitespace-pre">Retouching</p>
      </div>
    </div>
  );
}

function Group203() {
  return (
    <div
      className="absolute bottom-[4.166%] left-[4.166%] right-[8.301%] top-[8.301%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11 11"
      >
        <g id="Group">
          <path
            d={svgPaths.p2d5c0100}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group204() {
  return (
    <div
      className="absolute bottom-[4.166%] contents left-[4.166%] right-[8.301%] top-[8.301%]"
      data-name="Group"
    >
      <Group203 />
    </div>
  );
}

function Group205() {
  return (
    <div
      className="absolute bottom-[4.166%] contents left-[4.166%] right-[8.301%] top-[8.301%]"
      data-name="Group"
    >
      <Group204 />
    </div>
  );
}

function MessageCircle4() {
  return (
    <div
      className="absolute left-2 overflow-clip size-3 top-1.5"
      data-name="message-circle"
    >
      <Group205 />
    </div>
  );
}

function Container24() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0.5)] h-6 left-[21px] rounded-xl top-[161px] w-10"
      data-name="Container"
    >
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-xl" />
      <MessageCircle4 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-6 not-italic text-[#ffffff] text-[12px] text-left text-nowrap top-1">
        <p className="block leading-[16px] whitespace-pre">6</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0.5)] h-6 left-[177px] rounded-md top-[161px] w-[45px]"
      data-name="Container"
    >
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-md" />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-2 not-italic text-[#ffffff] text-[12px] text-left text-nowrap top-1">
        <p className="block leading-[16px] whitespace-pre">00:11</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div
      className="absolute bg-[#292b36] h-[340px] left-6 rounded-lg top-[486px] w-[243px]"
      data-name="Container"
    >
      <div className="absolute border border-gray-600 border-solid inset-0 pointer-events-none rounded-lg" />
      <div className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[0] left-[13px] not-italic text-[#ffffff] text-[14px] text-left text-nowrap top-[205px]">
        <p className="block leading-[20px] whitespace-pre">
          DRP_A002_0816PS_V1_0080.mov
        </p>
      </div>
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[13px] not-italic text-[#a0a3b5] text-[12px] text-left text-nowrap top-[229px]">
        <p className="block leading-[16px] whitespace-pre">
          Alissa Morris • Oct 14th, 2024
        </p>
      </div>
      <Container22 />
      <Container23 />
      <div
        className="absolute bg-[#d9d9d9] h-[180px] left-[13px] rounded-md top-[13px] w-[216.5px]"
        data-name="Image"
      >
        <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-md" />
      </div>
      <Container24 />
      <Container25 />
    </div>
  );
}

function Group206() {
  return (
    <div
      className="absolute bottom-[33.25%] left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 10 6"
      >
        <g id="Group">
          <path
            d={svgPaths.pee98f80}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group207() {
  return (
    <div
      className="absolute bottom-[33.25%] contents left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <Group206 />
    </div>
  );
}

function Group208() {
  return (
    <div
      className="absolute bottom-[33.25%] contents left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <Group207 />
    </div>
  );
}

function ChevronDown6() {
  return (
    <div
      className="absolute left-[191px] overflow-clip size-4 top-[11px]"
      data-name="chevron-down"
    >
      <Group208 />
    </div>
  );
}

function Container27() {
  return (
    <div
      className="absolute bg-[#1f2029] h-[38px] left-[13px] rounded-md top-[257px] w-[217px]"
      data-name="Container"
    >
      <div className="absolute border border-gray-600 border-solid inset-0 pointer-events-none rounded-md" />
      <ChevronDown6 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[9px] not-italic text-[#ffffff] text-[14px] text-left text-nowrap top-[9px]">
        <p className="block leading-[20px] whitespace-pre">Role</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div
      className="absolute bg-[#5c4533] h-6 left-[13px] rounded-xl top-[303px] w-[65px]"
      data-name="Container"
    >
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-xl" />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-2 not-italic text-[#f3a533] text-[12px] text-left text-nowrap top-1">
        <p className="block leading-[16px] whitespace-pre">Coloring</p>
      </div>
    </div>
  );
}

function Group209() {
  return (
    <div
      className="absolute bottom-[4.166%] left-[4.166%] right-[8.301%] top-[8.301%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11 11"
      >
        <g id="Group">
          <path
            d={svgPaths.p2d5c0100}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group210() {
  return (
    <div
      className="absolute bottom-[4.166%] contents left-[4.166%] right-[8.301%] top-[8.301%]"
      data-name="Group"
    >
      <Group209 />
    </div>
  );
}

function Group211() {
  return (
    <div
      className="absolute bottom-[4.166%] contents left-[4.166%] right-[8.301%] top-[8.301%]"
      data-name="Group"
    >
      <Group210 />
    </div>
  );
}

function MessageCircle5() {
  return (
    <div
      className="absolute left-2 overflow-clip size-3 top-1.5"
      data-name="message-circle"
    >
      <Group211 />
    </div>
  );
}

function Container29() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0.5)] h-6 left-[21px] rounded-xl top-[161px] w-[45px]"
      data-name="Container"
    >
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-xl" />
      <MessageCircle5 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-6 not-italic text-[#ffffff] text-[12px] text-left text-nowrap top-1">
        <p className="block leading-[16px] whitespace-pre">12</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0.5)] h-6 left-[174px] rounded-md top-[161px] w-[47px]"
      data-name="Container"
    >
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-md" />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-2 not-italic text-[#ffffff] text-[12px] text-left text-nowrap top-1">
        <p className="block leading-[16px] whitespace-pre">00:21</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div
      className="absolute bg-[#292b36] h-[340px] left-[290px] rounded-lg top-[486px] w-[243px]"
      data-name="Container"
    >
      <div className="absolute border border-gray-600 border-solid inset-0 pointer-events-none rounded-lg" />
      <div className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[0] left-[13px] not-italic text-[#ffffff] text-[14px] text-left text-nowrap top-[205px]">
        <p className="block leading-[20px] whitespace-pre">
          DRP_B027_0815Y6_V1_0049.mov
        </p>
      </div>
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[13px] not-italic text-[#a0a3b5] text-[12px] text-left text-nowrap top-[229px]">
        <p className="block leading-[16px] whitespace-pre">
          Alissa Morris • Oct 14th, 2024
        </p>
      </div>
      <Container27 />
      <Container28 />
      <div
        className="absolute bg-[#d9d9d9] h-[180px] left-[13px] rounded-md top-[13px] w-[216.5px]"
        data-name="Image"
      >
        <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-md" />
      </div>
      <Container29 />
      <Container30 />
    </div>
  );
}

function Group212() {
  return (
    <div
      className="absolute bottom-[33.25%] left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 10 6"
      >
        <g id="Group">
          <path
            d={svgPaths.pee98f80}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group213() {
  return (
    <div
      className="absolute bottom-[33.25%] contents left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <Group212 />
    </div>
  );
}

function Group214() {
  return (
    <div
      className="absolute bottom-[33.25%] contents left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <Group213 />
    </div>
  );
}

function ChevronDown7() {
  return (
    <div
      className="absolute left-[191px] overflow-clip size-4 top-[11px]"
      data-name="chevron-down"
    >
      <Group214 />
    </div>
  );
}

function Container32() {
  return (
    <div
      className="absolute bg-[#1f2029] h-[38px] left-[13px] rounded-md top-[257px] w-[217px]"
      data-name="Container"
    >
      <div className="absolute border border-gray-600 border-solid inset-0 pointer-events-none rounded-md" />
      <ChevronDown7 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[9px] not-italic text-[#ffffff] text-[14px] text-left text-nowrap top-[9px]">
        <p className="block leading-[20px] whitespace-pre">Role</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div
      className="absolute bg-[#5c4533] h-6 left-2 rounded-xl top-[46px] w-20"
      data-name="Container"
    >
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-xl" />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-2 not-italic text-[#f3a533] text-[12px] text-left text-nowrap top-1">
        <p className="block leading-[16px] whitespace-pre">Retouching</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div
      className="absolute bg-[#3b574f] h-6 left-[91px] rounded-xl top-[46px] w-[51px]"
      data-name="Container"
    >
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-xl" />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-2 not-italic text-[12px] text-emerald-300 text-left text-nowrap top-1">
        <p className="block leading-[16px] whitespace-pre">Social</p>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div
      className="absolute bg-[#5c4533] h-6 left-2 rounded-xl top-[74px] w-[65px]"
      data-name="Container"
    >
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-xl" />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-2 not-italic text-[#f3a533] text-[12px] text-left text-nowrap top-1">
        <p className="block leading-[16px] whitespace-pre">Coloring</p>
      </div>
    </div>
  );
}

function Group215() {
  return (
    <div
      className="absolute bottom-[8.288%] left-[65.164%] right-[8.288%] top-[65.164%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 5 5"
      >
        <g id="Group">
          <path
            d={svgPaths.p2c66bc80}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group216() {
  return (
    <div
      className="absolute bottom-[16.5%] left-[8.125%] right-[16.5%] top-[8.125%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 13 13"
      >
        <g id="Group">
          <path
            d={svgPaths.p283aa700}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group217() {
  return (
    <div
      className="absolute bottom-[8.288%] contents left-[8.125%] right-[8.29%] top-[8.125%]"
      data-name="Group"
    >
      <Group215 />
      <Group216 />
    </div>
  );
}

function Group218() {
  return (
    <div
      className="absolute bottom-[8.288%] contents left-[8.125%] right-[8.29%] top-[8.125%]"
      data-name="Group"
    >
      <Group217 />
    </div>
  );
}

function Search2() {
  return (
    <div
      className="absolute left-8 overflow-clip size-4 translate-y-[-50%]"
      data-name="Search"
      style={{ top: "calc(50% + 0.5px)" }}
    >
      <Group218 />
    </div>
  );
}

function Textbox1() {
  return (
    <div
      className="absolute bg-[#1f2029] h-[29px] left-2 rounded-md top-2 w-[200px]"
      data-name="Textbox"
    >
      <div className="absolute border border-gray-600 border-solid inset-[-0.5px] pointer-events-none rounded-[6.5px]" />
      <div
        className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[54px] not-italic right-[51px] text-[14px] text-gray-400 text-left text-nowrap"
        style={{ top: "calc(50% - 10.5px)" }}
      >
        <p className="block leading-[22px] whitespace-pre">Find an option</p>
      </div>
      <Search2 />
    </div>
  );
}

function Container36() {
  return (
    <div
      className="absolute bg-[rgba(41,43,54,0.9)] h-[106px] left-[13px] rounded-bl-[6px] rounded-br-[6px] top-[87px] w-[217px]"
      data-name="Container"
    >
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-bl-[6px] rounded-br-[6px]" />
      <Container33 />
      <Container34 />
      <Container35 />
      <Textbox1 />
    </div>
  );
}

function Group219() {
  return (
    <div
      className="absolute bottom-[4.166%] left-[4.166%] right-[8.301%] top-[8.301%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11 11"
      >
        <g id="Group">
          <path
            d={svgPaths.p2d5c0100}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group220() {
  return (
    <div
      className="absolute bottom-[4.166%] contents left-[4.166%] right-[8.301%] top-[8.301%]"
      data-name="Group"
    >
      <Group219 />
    </div>
  );
}

function Group221() {
  return (
    <div
      className="absolute bottom-[4.166%] contents left-[4.166%] right-[8.301%] top-[8.301%]"
      data-name="Group"
    >
      <Group220 />
    </div>
  );
}

function MessageCircle6() {
  return (
    <div
      className="absolute left-2 overflow-clip size-3 top-1.5"
      data-name="message-circle"
    >
      <Group221 />
    </div>
  );
}

function Container37() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0.5)] h-6 left-[21px] rounded-xl top-[161px] w-10"
      data-name="Container"
    >
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-xl" />
      <MessageCircle6 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-6 not-italic text-[#ffffff] text-[12px] text-left text-nowrap top-1">
        <p className="block leading-[16px] whitespace-pre">3</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0.5)] h-6 left-[172px] rounded-md top-[161px] w-[50px]"
      data-name="Container"
    >
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-md" />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-2 not-italic text-[#ffffff] text-[12px] text-left text-nowrap top-1">
        <p className="block leading-[16px] whitespace-pre">00:32</p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div
      className="absolute bg-[#292b36] h-[340px] left-[557px] rounded-lg top-[486px] w-[243px]"
      data-name="Container"
    >
      <div className="absolute border border-indigo-500 border-solid inset-0 pointer-events-none rounded-lg" />
      <div className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[0] left-[13px] not-italic text-[#ffffff] text-[14px] text-left text-nowrap top-[205px]">
        <p className="block leading-[20px] whitespace-pre">
          DRP_B026_0815HR_V1_0047.mov
        </p>
      </div>
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[13px] not-italic text-[#a0a3b5] text-[12px] text-left text-nowrap top-[229px]">
        <p className="block leading-[16px] whitespace-pre">
          Alissa Morris • Oct 14th, 2024
        </p>
      </div>
      <Container32 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[13px] not-italic text-[#a0a3b5] text-[12px] text-left text-nowrap top-[303px]">
        <p className="block leading-[16px] whitespace-pre">Select an option</p>
      </div>
      <div
        className="absolute bg-[#d9d9d9] h-[180px] left-[13px] rounded-md top-[13px] w-[216.5px]"
        data-name="Image"
      >
        <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-md" />
      </div>
      <Container36 />
      <Container37 />
      <Container38 />
    </div>
  );
}

function Group222() {
  return (
    <div
      className="absolute bottom-[33.25%] left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 10 6"
      >
        <g id="Group">
          <path
            d={svgPaths.pee98f80}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group223() {
  return (
    <div
      className="absolute bottom-[33.25%] contents left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <Group222 />
    </div>
  );
}

function Group224() {
  return (
    <div
      className="absolute bottom-[33.25%] contents left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <Group223 />
    </div>
  );
}

function ChevronDown8() {
  return (
    <div
      className="absolute left-[191px] overflow-clip size-4 top-[11px]"
      data-name="chevron-down"
    >
      <Group224 />
    </div>
  );
}

function Container40() {
  return (
    <div
      className="absolute bg-[#1f2029] h-[38px] left-[13px] rounded-md top-[257px] w-[217px]"
      data-name="Container"
    >
      <div className="absolute border border-gray-600 border-solid inset-0 pointer-events-none rounded-md" />
      <ChevronDown8 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[9px] not-italic text-[#ffffff] text-[14px] text-left text-nowrap top-[9px]">
        <p className="block leading-[20px] whitespace-pre">Role</p>
      </div>
    </div>
  );
}

function Group225() {
  return (
    <div
      className="absolute bottom-[25.125%] left-[12.651%] right-[12.65%] top-[20.925%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 11"
      >
        <g id="Group">
          <path
            d={svgPaths.p2f3fcb00}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group226() {
  return (
    <div
      className="absolute bottom-[25.125%] contents left-[12.651%] right-[12.65%] top-[20.925%]"
      data-name="Group"
    >
      <Group225 />
    </div>
  );
}

function Group227() {
  return (
    <div
      className="absolute bottom-[25.125%] contents left-[12.651%] right-[12.65%] top-[20.925%]"
      data-name="Group"
    >
      <Group226 />
    </div>
  );
}

function Check2() {
  return (
    <div
      className="absolute left-[21px] overflow-clip size-5 top-[21px]"
      data-name="check"
    >
      <Group227 />
    </div>
  );
}

function Group228() {
  return (
    <div
      className="absolute bottom-[4.166%] left-[4.166%] right-[8.301%] top-[8.301%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11 11"
      >
        <g id="Group">
          <path
            d={svgPaths.p2d5c0100}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group229() {
  return (
    <div
      className="absolute bottom-[4.166%] contents left-[4.166%] right-[8.301%] top-[8.301%]"
      data-name="Group"
    >
      <Group228 />
    </div>
  );
}

function Group230() {
  return (
    <div
      className="absolute bottom-[4.166%] contents left-[4.166%] right-[8.301%] top-[8.301%]"
      data-name="Group"
    >
      <Group229 />
    </div>
  );
}

function MessageCircle7() {
  return (
    <div
      className="absolute left-2 overflow-clip size-3 top-1.5"
      data-name="message-circle"
    >
      <Group230 />
    </div>
  );
}

function Container41() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0.5)] h-6 left-[21px] rounded-xl top-[161px] w-10"
      data-name="Container"
    >
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-xl" />
      <MessageCircle7 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-6 not-italic text-[#ffffff] text-[12px] text-left text-nowrap top-1">
        <p className="block leading-[16px] whitespace-pre">5</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0.5)] h-6 left-[171px] rounded-md top-[161px] w-[50px]"
      data-name="Container"
    >
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-md" />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-2 not-italic text-[#ffffff] text-[12px] text-left text-nowrap top-1">
        <p className="block leading-[16px] whitespace-pre">00:03</p>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div
      className="absolute bg-[#292b36] h-[340px] left-[823px] rounded-lg top-[486px] w-[243px]"
      data-name="Container"
    >
      <div className="absolute border border-gray-600 border-solid inset-0 pointer-events-none rounded-lg" />
      <div className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[0] left-[13px] not-italic text-[#ffffff] text-[14px] text-left text-nowrap top-[205px]">
        <p className="block leading-[20px] whitespace-pre">
          DRP_B014_08155T_V1_0039.mov
        </p>
      </div>
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[13px] not-italic text-[#a0a3b5] text-[12px] text-left text-nowrap top-[229px]">
        <p className="block leading-[16px] whitespace-pre">
          Alissa Morris • Oct 14th, 2024
        </p>
      </div>
      <Container40 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[13px] not-italic text-[#a0a3b5] text-[12px] text-left text-nowrap top-[303px]">
        <p className="block leading-[16px] whitespace-pre">Select an option</p>
      </div>
      <div
        className="absolute bg-[#d9d9d9] h-[180px] left-[13px] rounded-md top-[13px] w-[216.5px]"
        data-name="Image"
      >
        <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-md" />
      </div>
      <Check2 />
      <Container41 />
      <Container42 />
    </div>
  );
}

function Container44() {
  return (
    <div
      className="absolute bg-[#1f2029] h-[780px] left-[280px] top-0 w-[1090px]"
      data-name="Container"
    >
      <div className="h-[780px] overflow-clip relative w-[1090px]">
        <LayoutGrid1 />
        <div className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[0] left-11 not-italic text-[#ffffff] text-[14px] text-left text-nowrap top-[29px]">
          <p className="block leading-[20px] whitespace-pre">Appearance</p>
        </div>
        <Star1 />
        <div className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[0] left-[206px] not-italic text-[#a0a3b5] text-[14px] text-left text-nowrap top-[30px]">
          <p className="block leading-[20px] whitespace-pre">1 Visible</p>
        </div>
        <div className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[0] left-[163px] not-italic text-[#ffffff] text-[14px] text-left text-nowrap top-[29px]">
          <p className="block leading-[20px] whitespace-pre">Fields</p>
        </div>
        <Image6 />
        <div className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[0] left-[367px] not-italic text-[#a0a3b5] text-[14px] text-left text-nowrap top-[30px]">
          <p className="block leading-[20px] whitespace-pre">Date Uploaded</p>
        </div>
        <div className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[0] left-[298px] not-italic text-[#ffffff] text-[14px] text-left text-nowrap top-[29px]">
          <p className="block leading-[20px] whitespace-pre">Sorted by</p>
        </div>
        <Search1 />
        <Textbox />
        <Container3 />
        <Avatar />
        <Avatar1 />
        <Avatar2 />
        <ChevronDown />
        <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-12 not-italic text-[#ffffff] text-[14px] text-left text-nowrap top-[79px]">
          <p className="block leading-[20px] whitespace-pre">16 Assets</p>
        </div>
        <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[118px] not-italic text-[#a0a3b5] text-[14px] text-left text-nowrap top-[79px]">
          <p className="block leading-[20px] whitespace-pre">•</p>
        </div>
        <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[134px] not-italic text-[#a0a3b5] text-[14px] text-left text-nowrap top-[79px]">
          <p className="block leading-[20px] whitespace-pre">134 GB</p>
        </div>
        <Container7 />
        <Container12 />
        <Container16 />
        <Container21 />
        <Container26 />
        <Container31 />
        <Container39 />
        <Container43 />
      </div>
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Container45() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0)] h-[780px] left-[70px] top-[60px] w-[1370px]"
      data-name="Container"
    >
      <div className="h-[780px] overflow-clip relative w-[1370px]">
        <Container2 />
        <Container44 />
      </div>
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Group231() {
  return (
    <div className="absolute inset-[24.875%]" data-name="Group">
      <div className="absolute bottom-[-8.333%] left-[-8.333%] right-[-8.333%] top-[-8.333%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 10 10"
        >
          <g id="Group">
            <path
              d="M9.04 1L1 9.04"
              id="Vector"
              stroke="var(--stroke-0, white)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.34"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group232() {
  return (
    <div className="absolute inset-[24.875%]" data-name="Group">
      <div className="absolute bottom-[-8.333%] left-[-8.333%] right-[-8.333%] top-[-8.333%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 10 10"
        >
          <g id="Group">
            <path
              d="M1 1L9.04 9.04"
              id="Vector"
              stroke="var(--stroke-0, white)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.34"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group233() {
  return (
    <div className="absolute contents inset-[24.875%]" data-name="Group">
      <Group231 />
      <Group232 />
    </div>
  );
}

function Group234() {
  return (
    <div className="absolute contents inset-[24.875%]" data-name="Group">
      <Group233 />
    </div>
  );
}

function Group235() {
  return (
    <div className="absolute contents inset-[24.875%]" data-name="Group">
      <Group234 />
    </div>
  );
}

function Group236() {
  return (
    <div className="absolute contents inset-[24.875%]" data-name="Group">
      <Group235 />
    </div>
  );
}

function Image7() {
  return (
    <div className="absolute left-4 size-4 top-[22px]" data-name="Image">
      <div className="overflow-clip relative size-4">
        <Group236 />
      </div>
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Group237() {
  return (
    <div className="absolute inset-[41.625%]" data-name="Group">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 3 3"
      >
        <g id="Group">
          <path
            d={svgPaths.p13bbb200}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group238() {
  return (
    <div
      className="absolute bottom-[41.625%] left-[70.813%] right-[12.438%] top-[41.625%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 3 3"
      >
        <g id="Group">
          <path
            d={svgPaths.p13bbb200}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group239() {
  return (
    <div
      className="absolute bottom-[41.625%] left-[12.438%] right-[70.813%] top-[41.625%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 3 3"
      >
        <g id="Group">
          <path
            d={svgPaths.p2ff22e80}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group240() {
  return (
    <div
      className="absolute bottom-[41.625%] contents left-[12.438%] right-[12.438%] top-[41.625%]"
      data-name="Group"
    >
      <Group237 />
      <Group238 />
      <Group239 />
    </div>
  );
}

function Group241() {
  return (
    <div
      className="absolute bottom-[41.625%] contents left-[12.438%] right-[12.438%] top-[41.625%]"
      data-name="Group"
    >
      <Group240 />
    </div>
  );
}

function Ellipsis() {
  return (
    <div
      className="absolute left-1/2 overflow-clip size-4 top-1/2 translate-x-[-50%] translate-y-[-50%]"
      data-name="Ellipsis"
    >
      <Group241 />
    </div>
  );
}

function Button() {
  return (
    <div
      className="absolute bg-gray-600 left-[938px] rounded-md size-10 top-2.5"
      data-name="Button"
    >
      <div className="overflow-clip relative size-10">
        <div
          className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic text-[#ffffff] text-[14px] text-left text-nowrap"
          style={{ top: "calc(50% - 11px)", left: "calc(50% + 8px)" }}
        >
          <p className="block leading-[22px] whitespace-pre">&nbsp;</p>
        </div>
        <Ellipsis />
      </div>
      <div className="absolute border-0 border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-md" />
    </div>
  );
}

function Group242() {
  return (
    <div
      className="absolute bottom-[3.938%] left-[45.813%] right-[45.813%] top-[3.938%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 2 15"
      >
        <g id="Group">
          <path
            d={svgPaths.p1f89ab00}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group243() {
  return (
    <div
      className="absolute bottom-[4.095%] left-[33.251%] right-[33.25%] top-[74.969%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 6 4"
      >
        <g id="Group">
          <path
            d={svgPaths.p2e6a5400}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group244() {
  return (
    <div
      className="absolute bottom-[33.25%] left-[74.969%] right-[4.095%] top-[33.251%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 4 6"
      >
        <g id="Group">
          <path d={svgPaths.pc93b3f0} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group245() {
  return (
    <div
      className="absolute bottom-[45.813%] left-[3.938%] right-[3.938%] top-[45.813%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 2"
      >
        <g id="Group">
          <path
            d={svgPaths.p38d72400}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group246() {
  return (
    <div
      className="absolute bottom-[33.251%] left-[4.094%] right-[74.969%] top-[33.251%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 4 6"
      >
        <g id="Group">
          <path
            d={svgPaths.p1200c600}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group247() {
  return (
    <div
      className="absolute bottom-[74.969%] left-[33.25%] right-[33.251%] top-[4.095%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 6 4"
      >
        <g id="Group">
          <path
            d={svgPaths.p1262e800}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group248() {
  return (
    <div className="absolute contents inset-[3.938%]" data-name="Group">
      <Group242 />
      <Group243 />
      <Group244 />
      <Group245 />
      <Group246 />
      <Group247 />
    </div>
  );
}

function Group249() {
  return (
    <div className="absolute contents inset-[3.938%]" data-name="Group">
      <Group248 />
    </div>
  );
}

function Move() {
  return (
    <div
      className="absolute overflow-clip size-4 top-1/2 translate-x-[-50%] translate-y-[-50%]"
      data-name="Move"
      style={{ left: "calc(50% - 31px)" }}
    >
      <Group249 />
    </div>
  );
}

function Button1() {
  return (
    <div
      className="absolute bg-gray-600 h-10 left-[994px] rounded-md top-2.5 w-[109.797px]"
      data-name="Button"
    >
      <div className="h-10 overflow-clip relative w-[109.797px]">
        <div
          className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic text-[#ffffff] text-[14px] text-left text-nowrap"
          style={{ top: "calc(50% - 11px)", left: "calc(50% - 15px)" }}
        >
          <p className="block leading-[22px] whitespace-pre">Move to</p>
        </div>
        <Move />
      </div>
      <div className="absolute border-0 border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-md" />
    </div>
  );
}

function Group250() {
  return (
    <div
      className="absolute bottom-[8.25%] left-[8.125%] right-[8.125%] top-[58.25%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 14 6"
      >
        <g id="Group">
          <path
            d={svgPaths.p2b9d5e00}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group251() {
  return (
    <div
      className="absolute bottom-[33.282%] left-[24.876%] right-[24.876%] top-[37.407%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 9 5"
      >
        <g id="Group">
          <path d={svgPaths.p7b43e30} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group252() {
  return (
    <div
      className="absolute bottom-[33.188%] left-[45.813%] right-[45.813%] top-[8.188%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 2 10"
      >
        <g id="Group">
          <path
            d={svgPaths.p1390f800}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group253() {
  return (
    <div
      className="absolute bottom-[8.25%] contents left-[8.125%] right-[8.125%] top-[8.188%]"
      data-name="Group"
    >
      <Group250 />
      <Group251 />
      <Group252 />
    </div>
  );
}

function Group254() {
  return (
    <div
      className="absolute bottom-[8.25%] contents left-[8.125%] right-[8.125%] top-[8.188%]"
      data-name="Group"
    >
      <Group253 />
    </div>
  );
}

function Download() {
  return (
    <div
      className="absolute overflow-clip size-4 top-1/2 translate-x-[-50%] translate-y-[-50%]"
      data-name="Download"
      style={{ left: "calc(50% - 37.5px)" }}
    >
      <Group254 />
    </div>
  );
}

function Button2() {
  return (
    <div
      className="absolute bg-gray-600 h-10 left-[1120px] rounded-md top-2.5 w-[123.094px]"
      data-name="Button"
    >
      <div className="h-10 overflow-clip relative w-[123.094px]">
        <div
          className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic text-[#ffffff] text-[14px] text-left text-nowrap"
          style={{ top: "calc(50% - 11px)", left: "calc(50% - 21.5px)" }}
        >
          <p className="block leading-[22px] whitespace-pre">Download</p>
        </div>
        <Download />
      </div>
      <div className="absolute border-0 border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-md" />
    </div>
  );
}

function Group255() {
  return (
    <div
      className="absolute bottom-[4.063%] left-[12.313%] right-[12.313%] top-[45.688%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 13 9"
      >
        <g id="Group">
          <path d={svgPaths.p287cfc0} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group256() {
  return (
    <div
      className="absolute bottom-[70.75%] left-[29.063%] right-[29.064%] top-[4.126%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 7 5"
      >
        <g id="Group">
          <path d={svgPaths.p1a0ca00} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group257() {
  return (
    <div
      className="absolute bottom-[33.156%] left-[45.813%] right-[45.813%] top-[4.031%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 2 11"
      >
        <g id="Group">
          <path
            d={svgPaths.p3bbfd480}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group258() {
  return (
    <div
      className="absolute bottom-[4.063%] contents left-[12.313%] right-[12.313%] top-[4.031%]"
      data-name="Group"
    >
      <Group255 />
      <Group256 />
      <Group257 />
    </div>
  );
}

function Group259() {
  return (
    <div
      className="absolute bottom-[4.063%] contents left-[12.313%] right-[12.313%] top-[4.031%]"
      data-name="Group"
    >
      <Group258 />
    </div>
  );
}

function Share2() {
  return (
    <div
      className="absolute overflow-clip size-4 top-1/2 translate-x-[-50%] translate-y-[-50%]"
      data-name="Share"
      style={{ left: "calc(50% - 23.5px)" }}
    >
      <Group259 />
    </div>
  );
}

function Button3() {
  return (
    <div
      className="absolute bg-indigo-500 h-10 left-[1259px] rounded-md top-2.5 w-[94.797px]"
      data-name="Button"
    >
      <div className="h-10 overflow-clip relative w-[94.797px]">
        <div
          className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic text-[#ffffff] text-[14px] text-left text-nowrap"
          style={{ top: "calc(50% - 11px)", left: "calc(50% - 7.5px)" }}
        >
          <p className="block leading-[22px] whitespace-pre">Share</p>
        </div>
        <Share2 />
      </div>
      <div className="absolute border-0 border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-md" />
    </div>
  );
}

function Container46() {
  return (
    <div
      className="absolute bg-[#292b36] h-[60px] left-[70px] top-[840px] w-[1370px]"
      data-name="Container"
    >
      <div className="absolute border-0 border-[#373a4b] border-solid inset-0 pointer-events-none" />
      <div className="absolute h-0 left-0 top-0 w-[1370px]" data-name="Line">
        <div className="absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1370 2"
          >
            <path d="M0 1H1370" id="Line" stroke="var(--stroke-0, #373A4B)" />
          </svg>
        </div>
      </div>
      <Image7 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[165px] not-italic text-[#a0a3b5] text-[14px] text-left text-nowrap top-[21px]">
        <p className="block leading-[20px] whitespace-pre">•</p>
      </div>
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[181px] not-italic text-[#a0a3b5] text-[14px] text-left text-nowrap top-[21px]">
        <p className="block leading-[20px] whitespace-pre">460 MB</p>
      </div>
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-10 not-italic text-[#ffffff] text-[14px] text-left text-nowrap top-[21px]">
        <p className="block leading-[20px] whitespace-pre">4 Assets selected</p>
      </div>
      <Button />
      <Button1 />
      <Button2 />
      <Button3 />
    </div>
  );
}

function Group260() {
  return (
    <div
      className="absolute bottom-[10.583%] left-[67.125%] right-[14.875%] top-[21.917%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 5 17"
      >
        <g id="Group">
          <path
            d={svgPaths.p2d0d600}
            fill="var(--fill-0, #D9D9D9)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group261() {
  return (
    <div
      className="absolute bottom-[10.583%] left-[67.125%] right-[14.875%] top-[21.917%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 5 17"
      >
        <g id="Group">
          <path
            d={svgPaths.p2d0d600}
            fill="var(--fill-0, #CED0F8)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group262() {
  return (
    <div
      className="absolute bottom-[23.083%] left-[41%] right-[41%] top-[9.417%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 5 17"
      >
        <g id="Group">
          <path
            d={svgPaths.p2d0d600}
            fill="var(--fill-0, #D9D9D9)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group263() {
  return (
    <div
      className="absolute bottom-[23.083%] left-[41%] right-[41%] top-[9.417%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 5 17"
      >
        <g id="Group">
          <path
            d={svgPaths.p2d0d600}
            fill="var(--fill-0, #878CED)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group264() {
  return (
    <div
      className="absolute bottom-[36.563%] left-[67.125%] right-[14.875%] top-[21.813%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 5 10"
      >
        <g id="Group">
          <path
            clipRule="evenodd"
            d={svgPaths.p28539780}
            fill="var(--fill-0, #636AE8)"
            fillRule="evenodd"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group265() {
  return (
    <div
      className="absolute bottom-[10.583%] left-[14.875%] right-[67.125%] top-[21.917%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 5 17"
      >
        <g id="Group">
          <path
            d={svgPaths.p37011b00}
            fill="var(--fill-0, #CED0F8)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group266() {
  return (
    <div
      className="absolute bottom-[10.583%] contents left-[14.875%] right-[14.879%] top-[9.417%]"
      data-name="Group"
    >
      <Group260 />
      <Group261 />
      <Group262 />
      <Group263 />
      <Group264 />
      <Group265 />
    </div>
  );
}

function Group267() {
  return (
    <div
      className="absolute bottom-[10.583%] contents left-[14.875%] right-[14.879%] top-[9.417%]"
      data-name="Group"
    >
      <Group266 />
    </div>
  );
}

function Group268() {
  return (
    <div
      className="absolute bottom-[10.583%] contents left-[14.875%] right-[14.879%] top-[9.417%]"
      data-name="Group"
    >
      <Group267 />
    </div>
  );
}

function Group269() {
  return (
    <div
      className="absolute bottom-[10.583%] contents left-[14.875%] right-[14.879%] top-[9.417%]"
      data-name="Group"
    >
      <Group268 />
    </div>
  );
}

function Image8() {
  return (
    <div className="absolute left-4 size-6 top-[18px]" data-name="Image">
      <div className="overflow-clip relative size-6">
        <Group269 />
      </div>
      <div className="absolute border-0 border-[#bcc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Group270() {
  return (
    <div
      className="absolute bottom-[20.688%] left-[33.25%] right-[33.251%] top-[20.689%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 6 10"
      >
        <g id="Group">
          <path
            d={svgPaths.p23098f80}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group271() {
  return (
    <div
      className="absolute bottom-[20.688%] contents left-[33.25%] right-[33.251%] top-[20.689%]"
      data-name="Group"
    >
      <Group270 />
    </div>
  );
}

function Group272() {
  return (
    <div
      className="absolute bottom-[20.688%] contents left-[33.25%] right-[33.251%] top-[20.689%]"
      data-name="Group"
    >
      <Group271 />
    </div>
  );
}

function ChevronRight4() {
  return (
    <div
      className="absolute left-[124px] overflow-clip size-4 top-[21px]"
      data-name="chevron-right"
    >
      <Group272 />
    </div>
  );
}

function Group273() {
  return (
    <div
      className="absolute bottom-[20.688%] left-[33.25%] right-[33.251%] top-[20.689%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 6 10"
      >
        <g id="Group">
          <path
            d={svgPaths.p23098f80}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group274() {
  return (
    <div
      className="absolute bottom-[20.688%] contents left-[33.25%] right-[33.251%] top-[20.689%]"
      data-name="Group"
    >
      <Group273 />
    </div>
  );
}

function Group275() {
  return (
    <div
      className="absolute bottom-[20.688%] contents left-[33.25%] right-[33.251%] top-[20.689%]"
      data-name="Group"
    >
      <Group274 />
    </div>
  );
}

function ChevronRight5() {
  return (
    <div
      className="absolute left-[230px] overflow-clip size-4 top-[21px]"
      data-name="chevron-right"
    >
      <Group275 />
    </div>
  );
}

function Group276() {
  return (
    <div
      className="absolute bottom-[33.25%] left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 10 6"
      >
        <g id="Group">
          <path
            d={svgPaths.pee98f80}
            fill="var(--fill-0, #A0A3B5)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group277() {
  return (
    <div
      className="absolute bottom-[33.25%] contents left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <Group276 />
    </div>
  );
}

function Group278() {
  return (
    <div
      className="absolute bottom-[33.25%] contents left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <Group277 />
    </div>
  );
}

function ChevronDown9() {
  return (
    <div
      className="absolute left-[354px] overflow-clip size-4 top-[21px]"
      data-name="chevron-down"
    >
      <Group278 />
    </div>
  );
}

function Group279() {
  return (
    <div
      className="absolute bottom-[45.813%] left-[16.5%] right-[16.5%] top-[45.813%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11 2"
      >
        <g id="Group">
          <path
            d={svgPaths.p2e925080}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group280() {
  return (
    <div
      className="absolute bottom-[16.5%] left-[45.813%] right-[45.813%] top-[16.5%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 2 11"
      >
        <g id="Group">
          <path d={svgPaths.p4d71480} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group281() {
  return (
    <div className="absolute contents inset-[16.5%]" data-name="Group">
      <Group279 />
      <Group280 />
    </div>
  );
}

function Group282() {
  return (
    <div className="absolute contents inset-[16.5%]" data-name="Group">
      <Group281 />
    </div>
  );
}

function Plus5() {
  return (
    <div
      className="absolute overflow-clip size-4 top-1/2 translate-x-[-50%] translate-y-[-50%]"
      data-name="Plus"
      style={{ left: "calc(50% - 19px)" }}
    >
      <Group282 />
    </div>
  );
}

function Button4() {
  return (
    <div
      className="absolute bg-gray-600 h-10 left-[1235px] rounded-md top-[9px] w-[119px]"
      data-name="Button"
    >
      <div className="h-10 overflow-clip relative w-[119px]">
        <div
          className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic text-[#ffffff] text-[14px] text-left text-nowrap"
          style={{ top: "calc(50% - 11px)", left: "calc(50% - 3px)" }}
        >
          <p className="block leading-[22px] whitespace-pre">New</p>
        </div>
        <Plus5 />
      </div>
      <div className="absolute border-0 border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-md" />
    </div>
  );
}

function Group283() {
  return (
    <div className="absolute inset-[8.125%]" data-name="Group">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 14 14"
      >
        <g id="Group">
          <path
            d={svgPaths.p1b8e4c50}
            fill="var(--fill-0, #8C8F96)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group284() {
  return (
    <div
      className="absolute bottom-[58.313%] left-[8.125%] right-[8.125%] top-[33.313%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 14 2"
      >
        <g id="Group">
          <path
            d={svgPaths.p1d131b00}
            fill="var(--fill-0, #8C8F96)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group285() {
  return (
    <div
      className="absolute bottom-[33.313%] left-[8.125%] right-[8.125%] top-[58.313%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 14 2"
      >
        <g id="Group">
          <path
            d={svgPaths.p82f0680}
            fill="var(--fill-0, #8C8F96)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group286() {
  return (
    <div
      className="absolute bottom-[8.125%] left-[33.313%] right-[58.313%] top-[8.125%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 2 14"
      >
        <g id="Group">
          <path
            d={svgPaths.pbf71680}
            fill="var(--fill-0, #8C8F96)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group287() {
  return (
    <div
      className="absolute bottom-[8.125%] left-[58.313%] right-[33.313%] top-[8.125%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 2 14"
      >
        <g id="Group">
          <path
            d={svgPaths.p27ba1c00}
            fill="var(--fill-0, #8C8F96)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group288() {
  return (
    <div className="absolute contents inset-[8.125%]" data-name="Group">
      <Group283 />
      <Group284 />
      <Group285 />
      <Group286 />
      <Group287 />
    </div>
  );
}

function Group289() {
  return (
    <div className="absolute contents inset-[8.125%]" data-name="Group">
      <Group288 />
    </div>
  );
}

function Grid3X3() {
  return (
    <div
      className="absolute left-[660px] overflow-clip size-4 top-[15px]"
      data-name="grid-3x3"
    >
      <Group289 />
    </div>
  );
}

function Group290() {
  return (
    <div
      className="absolute bottom-[45.813%] left-[8.313%] right-[83.272%] top-[45.813%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 2 2"
      >
        <g id="Group">
          <path
            d={svgPaths.p27e42500}
            fill="var(--fill-0, #8C8F96)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group291() {
  return (
    <div
      className="absolute bottom-[20.813%] left-[8.313%] right-[83.272%] top-[70.813%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 2 2"
      >
        <g id="Group">
          <path
            d={svgPaths.p27e42500}
            fill="var(--fill-0, #8C8F96)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group292() {
  return (
    <div
      className="absolute bottom-[70.813%] left-[8.313%] right-[83.272%] top-[20.813%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 2 2"
      >
        <g id="Group">
          <path
            d={svgPaths.p262e7100}
            fill="var(--fill-0, #8C8F96)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group293() {
  return (
    <div
      className="absolute bottom-[45.813%] left-[29.031%] right-[8.156%] top-[45.813%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11 2"
      >
        <g id="Group">
          <path
            d={svgPaths.p2b921000}
            fill="var(--fill-0, #8C8F96)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group294() {
  return (
    <div
      className="absolute bottom-[20.813%] left-[29.031%] right-[8.156%] top-[70.813%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11 2"
      >
        <g id="Group">
          <path
            d={svgPaths.p2b921000}
            fill="var(--fill-0, #8C8F96)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group295() {
  return (
    <div
      className="absolute bottom-[70.813%] left-[29.031%] right-[8.156%] top-[20.813%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11 2"
      >
        <g id="Group">
          <path
            d={svgPaths.p14be5f00}
            fill="var(--fill-0, #8C8F96)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group296() {
  return (
    <div
      className="absolute bottom-[20.813%] contents left-[8.313%] right-[8.154%] top-[20.813%]"
      data-name="Group"
    >
      <Group290 />
      <Group291 />
      <Group292 />
      <Group293 />
      <Group294 />
      <Group295 />
    </div>
  );
}

function Group297() {
  return (
    <div
      className="absolute bottom-[20.813%] contents left-[8.313%] right-[8.154%] top-[20.813%]"
      data-name="Group"
    >
      <Group296 />
    </div>
  );
}

function List() {
  return (
    <div
      className="absolute left-[692px] overflow-clip size-4 top-[15px]"
      data-name="list"
    >
      <Group297 />
    </div>
  );
}

function Group298() {
  return (
    <div
      className="absolute bottom-[87.5%] left-[24.875%] right-[24.875%] top-[4.125%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 9 2"
      >
        <g id="Group">
          <path
            d={svgPaths.pdc33100}
            fill="var(--fill-0, #8C8F96)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group299() {
  return (
    <div
      className="absolute bottom-[70.813%] left-[16.5%] right-[16.5%] top-[20.813%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11 2"
      >
        <g id="Group">
          <path
            d={svgPaths.p19f00f00}
            fill="var(--fill-0, #8C8F96)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group300() {
  return (
    <div
      className="absolute bottom-[4%] left-[8.125%] right-[8.125%] top-[37.375%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 14 10"
      >
        <g id="Group">
          <path
            d={svgPaths.p375cdc80}
            fill="var(--fill-0, #8C8F96)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group301() {
  return (
    <div
      className="absolute bottom-[4%] contents left-[8.125%] right-[8.125%] top-[4.125%]"
      data-name="Group"
    >
      <Group298 />
      <Group299 />
      <Group300 />
    </div>
  );
}

function Group302() {
  return (
    <div
      className="absolute bottom-[4%] contents left-[8.125%] right-[8.125%] top-[4.125%]"
      data-name="Group"
    >
      <Group301 />
    </div>
  );
}

function GalleryVerticalEnd() {
  return (
    <div
      className="absolute left-[724px] overflow-clip size-4 top-[15px]"
      data-name="gallery-vertical-end"
    >
      <Group302 />
    </div>
  );
}

function Group303() {
  return (
    <div
      className="absolute bottom-[33.25%] left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 10 6"
      >
        <g id="Group">
          <path
            d={svgPaths.pee98f80}
            fill="var(--fill-0, #8C8F96)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group304() {
  return (
    <div
      className="absolute bottom-[33.25%] contents left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <Group303 />
    </div>
  );
}

function Group305() {
  return (
    <div
      className="absolute bottom-[33.25%] contents left-[20.689%] right-[20.688%] top-[33.251%]"
      data-name="Group"
    >
      <Group304 />
    </div>
  );
}

function ChevronDown10() {
  return (
    <div
      className="absolute left-[756px] overflow-clip size-4 top-[15px]"
      data-name="chevron-down"
    >
      <Group305 />
    </div>
  );
}

function Group306() {
  return (
    <div
      className="absolute bottom-[8.288%] left-[65.164%] right-[8.288%] top-[65.164%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 5 5"
      >
        <g id="Group">
          <path
            d={svgPaths.p2c66bc80}
            fill="var(--fill-0, #8C8F96)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group307() {
  return (
    <div
      className="absolute bottom-[16.5%] left-[8.125%] right-[16.5%] top-[8.125%]"
      data-name="Group"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 13 13"
      >
        <g id="Group">
          <path
            d={svgPaths.p283aa700}
            fill="var(--fill-0, #8C8F96)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group308() {
  return (
    <div
      className="absolute bottom-[8.288%] contents left-[8.125%] right-[8.29%] top-[8.125%]"
      data-name="Group"
    >
      <Group306 />
      <Group307 />
    </div>
  );
}

function Group309() {
  return (
    <div
      className="absolute bottom-[8.288%] contents left-[8.125%] right-[8.29%] top-[8.125%]"
      data-name="Group"
    >
      <Group308 />
    </div>
  );
}

function Search3() {
  return (
    <div
      className="absolute left-3 overflow-clip size-4 top-1/2 translate-y-[-50%]"
      data-name="Search"
    >
      <Group309 />
    </div>
  );
}

function Textbox2() {
  return (
    <div
      className="absolute bg-[#3d4045] h-7 left-[805px] rounded-md top-[9px] w-[150px]"
      data-name="Textbox"
    >
      <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-md" />
      <div
        className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[34px] not-italic right-[69px] text-[#8c8f96] text-[14px] text-left text-nowrap"
        style={{ top: "calc(50% - 11px)" }}
      >
        <p className="block leading-[22px] whitespace-pre">Search</p>
      </div>
      <Search3 />
    </div>
  );
}

function Container47() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0)] h-12 left-[158px] top-3 w-[972px]"
      data-name="Container"
    >
      <div className="absolute border-0 border-[#3d4045] border-solid inset-0 pointer-events-none" />
      <div className="absolute h-0 left-0 top-12 w-[972px]" data-name="Line">
        <div className="absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 972 2"
          >
            <path d="M0 1H972" id="Line" stroke="var(--stroke-0, #3D4045)" />
          </svg>
        </div>
      </div>
      <Grid3X3 />
      <List />
      <GalleryVerticalEnd />
      <ChevronDown10 />
      <div
        className="absolute h-6 left-[788px] top-[11px] w-0"
        data-name="Line"
      >
        <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 2 24"
          >
            <path d="M1 0V24" id="Line" stroke="var(--stroke-0, #3D4045)" />
          </svg>
        </div>
      </div>
      <Textbox2 />
    </div>
  );
}

function Container48() {
  return (
    <div
      className="absolute bg-[#292b36] h-[60px] left-[70px] top-[-2px] w-[1370px]"
      data-name="Container"
    >
      <div className="absolute border-0 border-[#373a4b] border-solid inset-0 pointer-events-none" />
      <div
        className="absolute h-0 left-0 top-[60px] w-[1370px]"
        data-name="Line"
      >
        <div className="absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1370 2"
          >
            <path d="M0 1H1370" id="Line" stroke="var(--stroke-0, #373A4B)" />
          </svg>
        </div>
      </div>
      <Image8 />
      <div className="absolute font-['Inter:Bold',_sans-serif] font-bold leading-[0] left-12 not-italic text-[#ffffff] text-[18px] text-left text-nowrap top-4">
        <p className="block leading-[28px] whitespace-pre">Filehunt</p>
      </div>
      <ChevronRight4 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[148px] not-italic text-[#a0a3b5] text-[16px] text-left text-nowrap top-[19px]">
        <p className="block leading-[24px] whitespace-pre">All Assets</p>
      </div>
      <ChevronRight5 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[254px] not-italic text-[#ffffff] text-[16px] text-left text-nowrap top-[19px]">
        <p className="block leading-[24px] whitespace-pre">Key Scenes</p>
      </div>
      <ChevronDown9 />
      <div
        className="absolute bg-[#7f56d9] left-[1155px] rounded-lg size-4 top-[21px]"
        data-name="Rectangle"
      >
        <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-lg" />
      </div>
      <div
        className="absolute bg-indigo-500 left-[1179px] rounded-lg size-4 top-[21px]"
        data-name="Rectangle"
      >
        <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-lg" />
      </div>
      <div
        className="absolute bg-blue-500 left-[1203px] rounded-lg size-4 top-[21px]"
        data-name="Rectangle"
      >
        <div className="absolute border-0 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-lg" />
      </div>
      <Button4 />
      <Container47 />
    </div>
  );
}

export default function KeyScenesAssetManagement() {
  return (
    <div
      className="bg-[#1f2029] relative shadow-[0px_3px_6px_0px_rgba(18,15,40,0.12)] size-full"
      data-name="Key Scenes Asset Management"
    >
      <Container />
      <Container45 />
      <Container46 />
      <Container48 />
    </div>
  );
}
