import svgPaths from "./svg-001";

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

export default function Container() {
  return (
    <div className="bg-[#292b36] relative size-full" data-name="Container">
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
