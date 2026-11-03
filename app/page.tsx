'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Bell, Blocks, BookOpen, Box, Bug, ExternalLink, Check, ChevronDown, ChevronRight, CircleUserRound, Code2, Cpu, Download, FileCode2, FileJson, FileText, FileType2, Folder, GitBranch, Hammer, Menu, Monitor, Play, Search, Settings, Sparkles, Terminal as TerminalIcon, X, Zap } from 'lucide-react'
import { DOWNLOADS, CONTACT_URL, HANDBOOK, RELEASES_URL, RELEASE_NOTES_URL } from '@/lib/site-config'

const files = [
  ['welcome.md', 'welcome', FileText], ['overview.md', 'overview', FileText], ['guide.md', 'guide', BookOpen], ['features.json', 'features', FileJson], ['platforms.yaml', 'platforms', FileType2], ['workflow.sh', 'workflow', TerminalIcon], ['architecture.rs', 'architecture', FileCode2], ['why-embedone.diff', 'why', FileCode2], ['get-started.md', 'get-started', FileText],
] as const
const featureData = ['Unified MCU + MPU support','Build, flash, debug, monitor in one loop','33 board profiles for STM32, NXP i.MX, Raspberry Pi, Espressif','Doctor workflows auto-install dependencies','Integrated serial console','Live GDB with debug profiles','Local AI + catalog discovery','Extension ecosystem']
const workflowData = [['Build','cargo build --release','Compiling embedone-core v1.0.0\nFinished release profile [optimized]'],['Doctor','embedone doctor','✓ Rust toolchain ready\n✓ OpenOCD found\n✓ GDB attached'],['Flash','embedone flash --board stm32f4','Connecting to ST-Link...\nWriting firmware 100%'],['Monitor','embedone monitor','[00:00:01.203] boot: EmbedOne\n[00:00:01.248] system ready'],['Debug','embedone debug','Breakpoint 1, main.rs:42\nPaused · Variables loaded']] as const

function DownloadButton({ platform='auto', variant='primary', size='md' }: { platform?: 'linux'|'windows'|'auto', variant?: 'primary'|'secondary', size?: 'sm'|'md'|'lg' }) {
  const [os, setOs] = useState<'windows'|'other'>('other')
  useEffect(() => { setOs(navigator.userAgent.toLowerCase().includes('win') ? 'windows' : 'other') }, [])
  // Windows visitors get the one installer they need; everyone else sees both, so a
  // Linux visitor still has something to click while their build is coming.
  const target = platform === 'auto' ? (os === 'windows' ? 'windows' : null) : platform
  const cfg = target ? DOWNLOADS[target] : null
  const sizeCls = size === 'md' ? '' : ` btn-${size}`
  if (cfg && cfg.url) return <a className={`btn btn-${variant}${sizeCls}`} href={cfg.url} download><Download size={size === 'sm' ? 13 : 15} aria-hidden="true"/>{cfg.label}</a>
  if (cfg) return <span className={`btn btn-soon${sizeCls}`} aria-disabled="true">{target === 'linux' ? 'Linux' : 'Windows'}<span className="soon-chip">Coming soon</span></span>
  return <div className="btn-row"><DownloadButton platform="windows" variant={variant} size={size}/><DownloadButton platform="linux" size={size}/></div>
}

export default function Page() {
  const [sidebar, setSidebar] = useState(false)
  const [terminal, setTerminal] = useState(false)
  const [palette, setPalette] = useState(false)
  const [active, setActive] = useState('welcome')
  const [account, setAccount] = useState(false)
  const [featureSearch, setFeatureSearch] = useState('')
  const [step, setStep] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initialWidth = window.innerWidth
    const initialMob = initialWidth <= 768
    setIsMobile(initialMob)
    if (!initialMob) {
      setSidebar(true)
    }
    let lastWidth = initialWidth
    const handleResize = () => {
      const currentWidth = window.innerWidth
      const mob = currentWidth <= 768
      setIsMobile(mob)
      if (lastWidth > 768 && mob) {
        setSidebar(false)
      } else if (lastWidth <= 768 && !mob) {
        setSidebar(true)
      }
      lastWidth = currentWidth
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => { const fn=(e:KeyboardEvent)=>{ const mod=e.ctrlKey||e.metaKey; if(mod&&e.key==='b'){e.preventDefault();setSidebar(v=>!v)} if(mod&&e.key==='`'){e.preventDefault();setTerminal(v=>!v)} if(mod&&(e.key==='k'||e.key==='p'&&e.shiftKey)){e.preventDefault();setPalette(true)} }; window.addEventListener('keydown',fn); return()=>window.removeEventListener('keydown',fn)},[])
  useEffect(() => {
    const scrollEl = scrollRef.current
    const obs = new IntersectionObserver(
      es => es.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { root: scrollEl, rootMargin: '-15% 0px -65%' }
    )
    files.forEach(([,id]) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])
  const go = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActive(id)
    }
    setPalette(false)
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      setSidebar(false)
    }
  }
  const filtered = featureData.filter(x => x.toLowerCase().includes(featureSearch.toLowerCase()))
  const activeFileName = files.find(([, id]) => id === active)?.[0] || `${active}.md`

  return <div className="vs-app">
    <header className="titlebar" role="banner">
      <div className="window-dots" aria-hidden="true"><i/><i/><i/></div>
      <nav className="menus" aria-label="Workbench menus">{['File','Edit','Selection','View','Go','Run','Terminal','Help'].map(x=><button key={x} onClick={()=>x==='Terminal'?setTerminal(v=>!v):x==='View'&&setSidebar(v=>!v)}>{x}</button>)}</nav>
      <button className="title-search" aria-label="Open command palette and file search" onClick={()=>setPalette(true)}><Search size={13} aria-hidden="true"/> <span>EmbedOne — {activeFileName}</span></button>
      <div className="titlebar-download">
        <DownloadButton platform="auto" size="sm"/>
      </div>
      <button className="mobile-menu" aria-label="Toggle explorer sidebar navigation" onClick={()=>setSidebar(v=>!v)}>
        <Menu size={16}/>
      </button>
    </header>
    <div className="workspace">
      <aside className="activity" aria-label="Activity bar">
        <button className={sidebar ? 'active' : ''} title="Explorer" aria-label="Explorer" onClick={()=>setSidebar(v=>!v)}><Blocks/></button>
        <button title="Search" aria-label="Search commands" onClick={()=>{setPalette(true);setSidebar(false)}}><Search/></button>
        <button title="Run and Debug" aria-label="Run and Debug workflow" onClick={()=>go('workflow')}><Bug/></button>
        <button title="Extensions" aria-label="Feature extensions" onClick={()=>go('features')}><Box/></button>
        <button title="Board profiles" aria-label="Board profiles" onClick={()=>go('platforms')}><Cpu/></button>
        <div className="activity-bottom">
          <button title="Account" aria-label="Account details" onClick={()=>setAccount(v=>!v)}><CircleUserRound/></button>
          <button title="Settings" aria-label="Settings"><Settings/></button>
        </div>
        {account&&<div className="account-menu"><a href={CONTACT_URL}>Contact</a><a href={RELEASE_NOTES_URL} target="_blank" rel="noopener noreferrer">Release notes</a></div>}
      </aside>
      {sidebar && <div className="sidebar-backdrop" onClick={()=>setSidebar(false)} />}
      {sidebar && <aside className="sidebar" id="project-explorer" aria-label="Project Explorer">
        <div className="side-head">
          <span>EXPLORER</span>
          <ChevronDown size={13} className="side-head-chevron"/>
          <button className="side-close" onClick={()=>setSidebar(false)} aria-label="Close Explorer"><X size={14}/></button>
        </div>
        <div className="root"><ChevronDown size={13}/><Folder size={14}/> EMBEDONE-WEBSITE</div>
        <div className="file-list" role="tree" aria-label="Files">{files.map(([name,id,Icon])=><button key={id} role="treeitem" aria-selected={active===id} className={active===id?'file-active':''} onClick={()=>go(id)}><Icon size={14}/><span>{name}</span></button>)}</div>
        <details open><summary>OUTLINE</summary><div className="outline">{active==='welcome'?'Welcome':active==='guide'?'What it is · How to use it · Handbook':active==='features'?'Features':active==='workflow'?'Build · Doctor · Flash · Monitor · Debug':'Overview · Details'}</div></details>
        <details open><summary>BOARD PROFILES</summary><div className="tree"><span><ChevronRight size={12}/> STM32</span><span><ChevronRight size={12}/> NXP i.MX</span><span><ChevronRight size={12}/> Raspberry Pi</span><span><ChevronRight size={12}/> Espressif</span></div></details>
      </aside>}
      <main className="editor" id="main-content" role="main"><div className="tabs" role="tablist" aria-label="Open editor tabs">{files.slice(0,4).map(([name,id,Icon])=><button key={id} role="tab" aria-selected={active===id} className={active===id?'tab-active':''} onClick={()=>go(id)}><Icon size={13}/>{name}<X size={12} aria-hidden="true"/></button>)}</div><div className="breadcrumbs" aria-label="Breadcrumb navigation"><span>embedone</span><ChevronRight size={12}/><span>src</span><ChevronRight size={12}/><b>{activeFileName}</b></div><div className="editor-scroll" ref={scrollRef}><div className="gutter" aria-hidden="true">{Array.from({length:220},(_,i)=><span key={i}>{i+1}</span>)}</div><div className="content">
        <section id="welcome" className="hero section" aria-labelledby="heading-welcome"><div className="eyebrow">// welcome.md</div><span className="badge"><Sparkles size={12} aria-hidden="true"/> Rust-powered · MCU + MPU · Windows now, Linux soon</span><div className="hero-grid"><div><h1 id="heading-welcome">One IDE for every embedded workflow.</h1><p className="lead">Build, flash, debug, and monitor firmware across MCU and MPU platforms from a single, vendor-neutral environment. No more juggling fragmented vendor toolchains.</p><div className="start-links"><DownloadButton platform="windows"/><div className="btn-row"><button className="btn btn-secondary" onClick={()=>go('features')}><Zap size={15} aria-hidden="true"/>Explore Features</button><button className="btn btn-secondary" onClick={()=>go('get-started')}><Play size={15} aria-hidden="true"/>Get Started</button></div></div><h3>Walkthroughs</h3><div className="walks"><button onClick={()=>go('workflow')}>↳ Set up your toolchain with doctor</button><button onClick={()=>go('workflow')}>↳ Flash your first board</button><button onClick={()=>go('workflow')}>↳ Attach the debugger</button></div><h3>Recent Board Targets</h3><div className="recent">{['STM32F4 Discovery','i.MX 8M Mini','Raspberry Pi 4','ESP32-S3'].map(x=><span key={x}><Cpu size={13}/> {x}<small>~/boards/{x.toLowerCase().replaceAll(' ','-')}</small></span>)}</div></div><MockIde/></div><p className="availability">Version 1.0.0 available for Windows · Linux build coming soon</p></section>
        <section className="trust" aria-label="Supported toolchains and industry stats"><span>Built around the tools embedded teams already rely on</span><div>{['Rust','GDB','OpenOCD','CMake','TypeScript','Linux','Windows'].map(x=><b key={x}>{x}</b>)}</div><div className="stats">{['33 board profiles','MCU + MPU in one tool','5 workflows, 1 environment','Windows now · Linux soon'].map(x=><span key={x}>{x}</span>)}</div></section>
        <section id="overview" className="section" aria-labelledby="heading-overview"><div className="eyebrow">// overview.md</div><h2 id="heading-overview">Stop switching tools. Start shipping firmware.</h2><div className="two-col"><p>Fragmented vendor IDEs, mismatched toolchains, and manual setup slow down every board bring-up. EmbedOne replaces that friction with one consistent experience for bare-metal firmware, embedded Linux, and hardware bring-up.</p><Converge/></div></section>
        <section id="guide" className="section guide" aria-labelledby="heading-guide"><div className="eyebrow">// guide.md</div><h2 id="heading-guide">What EmbedOne is, and how to use it.</h2>
          <div className="guide-intro"><p>EmbedOne is a desktop IDE for embedded development on Windows. Choose a board and it installs the exact compiler, build tools and chip support files that board needs, then lets you build, flash, watch serial output and debug from one window.</p><ul aria-label="What EmbedOne handles for you">{['Toolchains downloaded for each board, checksum-verified and kept in their own folder','On STM32 boards, Flash checks it is the right chip before writing, then verifies the write','Every step is also a command, such as embedone build, for scripts and CI'].map(x=><li key={x}><Check size={14} aria-hidden="true"/>{x}</li>)}</ul></div>
          <h3>How to use it</h3>
          <ol className="guide-steps">{([['Install','Run EmbedOne-1.0.0-Setup-x64.exe. It installs for your user account, with no administrator rights.'],['Create a workspace','On Workspace Home, choose Create workspace and pick a folder for it.'],['Add your board','Choose MCU or MPU, search for your board, and name the project.'],['Install dependencies','Check setup shows what the board needs; Install dependencies downloads it.'],['Build','Press Ctrl+Shift+B. The project shows how much flash and RAM the firmware uses.'],['Flash, monitor, debug','Ctrl+Alt+F flashes, Ctrl+Alt+M opens the serial console, and F5 starts the debugger on STM32 boards.']] as const).map(([title,body],i)=><li key={title}><b>0{i+1}</b><div><strong>{title}</strong><span>{body}</span></div></li>)}</ol>
          <h3>What each board family needs</h3>
          <div className="guide-cards">{([['STM32 Nucleo','Flashing and debugging need STM32CubeCLT from st.com, which takes a free ST account. Building works without it.'],['ESP32 and Raspberry Pi Pico','Programmed as Arduino sketches, with the tools installed for you. Hold BOOTSEL while plugging in a Pico for its first flash.'],['Raspberry Pi and NXP i.MX','Your app is built on the board over SSH, then deployed and run. The board needs SSH key login and its build tools.']] as const).map(([title,body])=><div key={title}><Cpu size={16} aria-hidden="true"/><b>{title}</b><p>{body}</p></div>)}</div>
          <div className="handbook"><BookOpen size={28} aria-hidden="true"/><div><b>The EmbedOne handbook</b><p>Installation, a step-by-step first project, every board family, the command line and troubleshooting. {HANDBOOK.pages} pages, PDF.</p></div><a className="btn btn-primary" href={HANDBOOK.url} target="_blank" rel="noopener"><Download size={15} aria-hidden="true"/>Read the handbook</a></div>
        </section>
        <section id="features" className="section" aria-labelledby="heading-features"><div className="eyebrow">// features.json</div><h2 id="heading-features">Everything you need, nothing you don&apos;t.</h2><input id="feature-search" aria-label="Search features" className="search-input" placeholder="Search features (e.g. GDB, serial, profiles)" value={featureSearch} onChange={e=>setFeatureSearch(e.target.value)}/><div className="feature-grid">{filtered.map((x,i)=><motion.article layout key={x} className="feature-card"><span className="feature-icon">{<FeatureIcon i={i} />}</span><b>{x}</b><small>EmbedOne Core · v1.0</small><p>{['A single workspace for every chip and Linux-capable board.','One loop from source to serial output.','Start fast with curated board profiles.','Set up dependencies without guesswork.','Watch logs without leaving your workflow.','Breakpoints, variables, and call stacks included.','Generate configs with local-first intelligence.','Add capabilities without losing coherence.'][i]}</p><em>Built in</em></motion.article>)}</div></section>
        <section id="platforms" className="section" aria-labelledby="heading-platforms"><div className="eyebrow">// platforms.yaml</div><h2 id="heading-platforms">From microcontrollers to Linux-capable SoCs.</h2><div className="platform-grid">{[['MCU',['STM32','Espressif'],'Fast, precise bare-metal development.'],['MPU',['NXP i.MX','Raspberry Pi'],'Bring up full Linux systems with confidence.']].map(([kind,items,desc])=><details open key={kind as string} className="platform-card"><summary><Cpu size={17} aria-hidden="true"/><b>{kind as string}</b><ChevronDown size={15} aria-hidden="true"/></summary><p>{desc as string}</p>{(items as string[]).map(x=><span key={x}><ChevronRight size={13} aria-hidden="true"/> {x}<small> · board profiles</small></span>)}</details>)}</div><div className="callout">33 board profiles and growing</div></section>
        <section id="workflow" className="section" aria-labelledby="heading-workflow"><div className="eyebrow">// workflow.sh</div><h2 id="heading-workflow">From first line to running hardware.</h2><div className="workflow-steps" role="tablist" aria-label="Workflow steps">{workflowData.map(([x],i)=><button className={step===i?'step-active':''} onClick={()=>setStep(i)} key={x} role="tab" aria-selected={step===i}><span>{i+1}</span>{x}</button>)}</div><div className="terminal-preview" role="region" aria-label="Workflow terminal preview"><div><span>embedone@workbench</span> <b>$ {workflowData[step][1]}</b></div><pre>{workflowData[step][2]}</pre></div></section>
        <section id="architecture" className="section" aria-labelledby="heading-architecture"><div className="eyebrow">// architecture.rs</div><h2 id="heading-architecture">Rust at the core. Extensible by design.</h2><div className="architecture"><div className="layers">{[['Desktop Workbench','TypeScript / JavaScript UI'],['Rust Core','Toolchain manager · board catalog · build and flash orchestration'],['Extension Ecosystem','Plugins · board packs · custom workflows']].map(([a,b],i)=><div className="layer" key={a}><code>src/{i===1?'core.rs':'workbench.ts'}</code><b>{a}</b><span>{b}</span></div>)}</div><div className="points">{['Memory safety and speed','Clean UI / core boundary','Extensible by design'].map(x=><div key={x}><Check size={14} aria-hidden="true"/> {x}</div>)}</div></div></section>
        <section id="why" className="section" aria-labelledby="heading-why"><div className="eyebrow">// why-embedone.diff</div><h2 id="heading-why">Less setup. Fewer surprises. Faster iteration.</h2><div className="benefits">{['One consistent mental model','Automation where it matters','Fair, vendor-neutral foundations'].map(x=><span key={x}><Check size={14} aria-hidden="true"/>{x}</span>)}</div><div className="diff"><div><header>Fragmented vendor tooling</header>{['- single environment','- cross-vendor boards','- manual toolchain setup','- local AI discovery','- scriptable automation','- MCU + MPU in one tool'].map(x=><p className="remove" key={x}>{x}</p>)}</div><div><header>EmbedOne</header>{['+ single environment','+ cross-vendor boards','+ automated toolchain setup','+ local-first AI discovery','+ scriptable automation','+ MCU + MPU in one tool'].map(x=><p className="add" key={x}>{x}</p>)}</div></div></section>
        <section id="get-started" className="section" aria-labelledby="heading-get-started"><div className="eyebrow">// get-started.md</div><h2 id="heading-get-started">Get EmbedOne for your platform.</h2><div className="downloads">{(['linux','windows'] as const).map(p=><div className="download-card" key={p}>{p==='linux'?<Monitor size={30} aria-hidden="true"/>:<Box size={30} aria-hidden="true"/>}<h3>{p[0].toUpperCase()+p.slice(1)}</h3><code>{DOWNLOADS[p].fileType}{DOWNLOADS[p].version ? ` · v${DOWNLOADS[p].version}` : ''}</code><p>Desktop app for modern embedded development.</p><DownloadButton platform={p}/></div>)}</div><p className="handbook-line"><BookOpen size={14} aria-hidden="true"/> New to EmbedOne? <a href={HANDBOOK.url} target="_blank" rel="noopener">Read the handbook (PDF)</a> for installation, a first project and troubleshooting.</p><div className="steps-row">{['Install EmbedOne','Run the doctor to set up your toolchain','Pick a board profile and build'].map((x,i)=><div key={x}><b>0{i+1}</b><span>{x}</span></div>)}</div><div className="notify"><Bell size={18} aria-hidden="true"/><div><b>Linux build coming soon</b><p>Windows 1.0.0 is available now. The Linux package is in progress; watch the releases page to see it land.</p></div><a className="btn btn-secondary" href={RELEASES_URL} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} aria-hidden="true"/>Watch releases on GitHub</a></div><div className="final-cta"><h2>Ship firmware faster with one environment.</h2><p>Bring your whole embedded workflow into one place.</p><div className="cta-actions"><DownloadButton platform="auto" size="lg"/><button className="btn btn-secondary btn-lg" onClick={()=>go('features')}><Zap size={15} aria-hidden="true"/>Explore Features</button><a className="btn btn-secondary btn-lg" href={HANDBOOK.url} target="_blank" rel="noopener"><BookOpen size={15} aria-hidden="true"/>Read the handbook</a></div></div></section>
      </div><div className="minimap" aria-hidden="true">{Array.from({length:32},(_,i)=><i key={i} style={{width:`${35+((i*37)%60)}%`}}/>)}</div></div></main></div>
    <footer className="status" role="contentinfo" aria-label="IDE status bar"><span><GitBranch size={13} aria-hidden="true"/> main</span><span>0 ⚠ 0 ✕</span><span>Toolchain ready</span><span className="status-right">Rust · UTF-8 · Ln 1, Col 1 · 33 board profiles <button aria-label="Check updates" onClick={()=>window.open(RELEASES_URL,'_blank','noopener')}><Bell size={13} aria-hidden="true"/></button></span></footer>
    <nav className="mobile-nav" aria-label="Mobile quick navigation">
      <button className={active==='welcome'?'nav-active':''} onClick={()=>go('welcome')} aria-label="Home section"><FileText size={18} aria-hidden="true"/><span>Home</span></button>
      <button className={active==='guide'?'nav-active':''} onClick={()=>go('guide')} aria-label="Guide and handbook section"><BookOpen size={18} aria-hidden="true"/><span>Guide</span></button>
      <button className={active==='features'?'nav-active':''} onClick={()=>go('features')} aria-label="Features section"><Box size={18} aria-hidden="true"/><span>Features</span></button>
      <button className={active==='workflow'?'nav-active':''} onClick={()=>go('workflow')} aria-label="Workflow section"><Bug size={18} aria-hidden="true"/><span>Workflow</span></button>
      <button className={active==='platforms'?'nav-active':''} onClick={()=>go('platforms')} aria-label="Boards and platforms section"><Cpu size={18} aria-hidden="true"/><span>Boards</span></button>
      <button className={active==='get-started'?'nav-active':''} onClick={()=>go('get-started')} aria-label="Download and get started section"><Download size={18} aria-hidden="true"/><span>Download</span></button>
    </nav>
    {terminal&&<div className="bottom-panel" role="region" aria-label="Terminal panel"><div className="panel-tabs"><b>PROBLEMS</b><b>OUTPUT</b><b className="selected">TERMINAL</b><b>DEBUG CONSOLE</b><button aria-label="Close terminal panel" onClick={()=>setTerminal(false)}><X size={14}/></button></div><pre><span>$ embedone doctor</span>{'\n'}✓ Toolchain ready{'\n'}✓ OpenOCD found{'\n'}✓ GDB attached{'\n'}<span>$ embedone build</span>{'\n'}Finished release profile [optimized]{'\n'}<span>$ embedone flash</span>{'\n'}Writing firmware 100%</pre></div>}
    {palette&&<div className="palette-backdrop" onClick={()=>setPalette(false)}><div className="palette" role="dialog" aria-modal="true" aria-label="Command palette" onClick={e=>e.stopPropagation()}><div className="palette-input"><span>&gt;</span><input autoFocus placeholder="Type a command..." aria-label="Command palette input" onKeyDown={e=>e.key==='Escape'&&setPalette(false)}/></div>{[['Go to: Guide','guide'],['Go to: Features','features'],['Go to: Platforms','platforms'],['Go to: Workflow','workflow'],['Go to: Architecture','architecture'],['Go to: Get EmbedOne','get-started'],['View: Toggle Sidebar','sidebar'],['View: Toggle Terminal Panel','terminal']].map(([x,id])=><button key={id} onClick={()=>id==='sidebar'?(setSidebar(v=>!v),setPalette(false)):id==='terminal'?(setTerminal(v=>!v),setPalette(false)):go(id)}>{x}<kbd>↵</kbd></button>)}</div></div>}
  </div>
}
function MockIde(){return <div className="mock-ide"><div className="mock-title">● ● <span>EmbedOne — main.c</span></div><div className="mock-body"><div className="mock-side"><Blocks size={15}/><FileText size={15}/><Bug size={15}/></div><div className="mock-code"><small>main.c</small><pre><i>1</i> <em>#include</em> <s>&lt;embedone.h&gt;</s>{'\n'}<i>2</i>{'\n'}<i>3</i> <em>int</em> <b>main</b>() {'{'}{'\n'}<i>4</i>   <em>board_init</em>();{'\n'}<i>5</i>   <em>serial_write</em>(<s>"hello"</s>);{'\n'}<i>6</i>   <em>return</em> <strong>0</strong>;{'\n'}<i>7</i>{'}'}</pre><div className="mock-bottom">BUILD&nbsp;&nbsp; MONITOR&nbsp;&nbsp; DEBUG<br/><span>[00:01] firmware ready · serial connected</span></div></div></div><div className="float-terminal"><b>$ embedone doctor</b><br/><span>✓ Toolchain ready</span><br/><span>✓ OpenOCD found</span><br/><span>✓ GDB attached</span></div></div>}
function Converge(){return <div className="converge">{['Vendor IDE','Flash tool','Serial monitor'].map(x=><span key={x}>{x} <ChevronRight/></span>)}<strong><Cpu/> EmbedOne</strong></div>}
function FeatureIcon({i}:{i:number}){
  switch(i){
    case 0:return <Code2 size={17}/>;
    case 1:return <Activity size={17}/>;
    case 2:return <Cpu size={17}/>;
    case 3:return <Activity size={17}/>;
    case 4:return <TerminalIcon size={17}/>;
    case 5:return <Bug size={17}/>;
    case 6:return <Sparkles size={17}/>;
    case 7:return <Blocks size={17}/>;
    default:return null;
  }
}
