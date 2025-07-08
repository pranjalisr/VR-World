"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Box, Sphere, Plane, Sky, Environment, Float, Html } from "@react-three/drei"
import { Vector3 } from "three"

interface VREnvironmentProps {
  environmentType: string
  onInteraction: (interaction: any) => void
}

// Realistic Human Avatar Component
function HumanAvatar({
  position,
  name,
  onInteract,
}: { position: [number, number, number]; name: string; onInteract: () => void }) {
  const avatarRef = useRef<any>()
  const [isWaving, setIsWaving] = useState(false)
  const [speechBubble, setSpeechBubble] = useState("")

  useFrame((state) => {
    if (avatarRef.current) {
      // Subtle breathing animation
      avatarRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02

      // Gentle swaying
      avatarRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
  })

  const handleClick = () => {
    setIsWaving(true)
    setSpeechBubble(`Hello! I'm ${name}. Welcome to this amazing place!`)
    onInteract()

    setTimeout(() => {
      setIsWaving(false)
      setSpeechBubble("")
    }, 3000)
  }

  return (
    <group position={position} onClick={handleClick}>
      {/* Human body */}
      <group ref={avatarRef}>
        {/* Head */}
        <Sphere args={[0.15, 16, 16]} position={[0, 1.7, 0]}>
          <meshStandardMaterial color="#fdbcb4" />
        </Sphere>

        {/* Eyes */}
        <Sphere args={[0.02, 8, 8]} position={[-0.05, 1.72, 0.12]}>
          <meshStandardMaterial color="#000000" />
        </Sphere>
        <Sphere args={[0.02, 8, 8]} position={[0.05, 1.72, 0.12]}>
          <meshStandardMaterial color="#000000" />
        </Sphere>

        {/* Body */}
        <Box args={[0.4, 0.8, 0.2]} position={[0, 1.2, 0]}>
          <meshStandardMaterial color="#4f46e5" />
        </Box>

        {/* Arms */}
        <Box args={[0.1, 0.6, 0.1]} position={[-0.3, 1.2, 0]} rotation={[0, 0, isWaving ? -0.8 : 0.2]}>
          <meshStandardMaterial color="#fdbcb4" />
        </Box>
        <Box args={[0.1, 0.6, 0.1]} position={[0.3, 1.2, 0]} rotation={[0, 0, isWaving ? 0.8 : -0.2]}>
          <meshStandardMaterial color="#fdbcb4" />
        </Box>

        {/* Legs */}
        <Box args={[0.15, 0.8, 0.15]} position={[-0.1, 0.4, 0]}>
          <meshStandardMaterial color="#1f2937" />
        </Box>
        <Box args={[0.15, 0.8, 0.15]} position={[0.1, 0.4, 0]}>
          <meshStandardMaterial color="#1f2937" />
        </Box>
      </group>

      {/* Speech bubble */}
      {speechBubble && (
        <Html position={[0, 2.2, 0]} center>
          <div className="bg-white p-2 rounded-lg shadow-lg max-w-xs text-sm border">{speechBubble}</div>
        </Html>
      )}

      {/* Name tag */}
      <Html position={[0, 0.2, 0]} center>
        <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs">{name}</div>
      </Html>
    </group>
  )
}

// Realistic Ocean Environment with Marine Life
function RealisticOceanEnvironment({ onInteraction }: { onInteraction: (interaction: any) => void }) {
  const fishGroupRef = useRef<any>()
  const [selectedFish, setSelectedFish] = useState<number | null>(null)
  const [bubbles, setBubbles] = useState<Array<{ id: number; position: Vector3; speed: number }>>([])

  useEffect(() => {
    // Generate bubbles
    const newBubbles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      position: new Vector3((Math.random() - 0.5) * 20, Math.random() * -5, (Math.random() - 0.5) * 20),
      speed: Math.random() * 0.02 + 0.01,
    }))
    setBubbles(newBubbles)
  }, [])

  useFrame((state) => {
    // Animate fish school
    if (fishGroupRef.current) {
      fishGroupRef.current.children.forEach((fish: any, i: number) => {
        fish.position.x = Math.sin(state.clock.elapsedTime + i) * 4
        fish.position.y = Math.cos(state.clock.elapsedTime * 0.5 + i) * 2 - 1
        fish.position.z = Math.sin(state.clock.elapsedTime * 0.3 + i) * 3
        fish.rotation.y = Math.atan2(
          Math.cos(state.clock.elapsedTime + i) * 4,
          Math.sin(state.clock.elapsedTime * 0.3 + i) * 3,
        )
      })
    }

    // Animate bubbles
    setBubbles((prev) =>
      prev
        .map((bubble) => ({
          ...bubble,
          position: new Vector3(bubble.position.x, bubble.position.y + bubble.speed, bubble.position.z),
        }))
        .filter((bubble) => bubble.position.y < 5),
    )
  })

  const handleFishClick = (fishId: number) => {
    setSelectedFish(fishId)
    onInteraction({
      type: "marine_life_interaction",
      target: `tropical_fish_${fishId}`,
      timestamp: Date.now(),
      details: "User observed tropical fish behavior",
    })

    setTimeout(() => setSelectedFish(null), 2000)
  }

  return (
    <>
      {/* Realistic ocean environment */}
      <Environment preset="sunset" />
      <fog attach="fog" args={["#006994", 5, 25]} />

      {/* Ocean floor with texture */}
      <Plane args={[40, 40]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
        <meshStandardMaterial color="#8b7355" roughness={0.8} normalScale={[0.5, 0.5]} />
      </Plane>

      {/* Coral reef ecosystem */}
      <group position={[-3, -3, 2]}>
        {/* Large coral formations */}
        <Box args={[1.5, 3, 1.5]} position={[0, 1.5, 0]}>
          <meshStandardMaterial color="#ff6b35" roughness={0.7} />
        </Box>
        <Sphere args={[1, 16, 16]} position={[2, 1, 1]}>
          <meshStandardMaterial color="#ff8c42" roughness={0.6} />
        </Sphere>

        {/* Sea anemones */}
        {[...Array(5)].map((_, i) => (
          <group key={i} position={[Math.random() * 4 - 2, 0, Math.random() * 4 - 2]}>
            <Box args={[0.1, 0.8, 0.1]} position={[0, 0.4, 0]}>
              <meshStandardMaterial color="#9333ea" />
            </Box>
            {[...Array(8)].map((_, j) => (
              <Box
                key={j}
                args={[0.05, 0.3, 0.05]}
                position={[Math.cos((j * Math.PI) / 4) * 0.2, 0.8, Math.sin((j * Math.PI) / 4) * 0.2]}
                rotation={[Math.random() * 0.5, (j * Math.PI) / 4, Math.random() * 0.3]}
              >
                <meshStandardMaterial color="#a855f7" />
              </Box>
            ))}
          </group>
        ))}
      </group>

      {/* School of fish with realistic behavior */}
      <group ref={fishGroupRef}>
        {[...Array(12)].map((_, i) => (
          <group key={i} onClick={() => handleFishClick(i)}>
            <Sphere args={[0.2, 8, 6]} position={[0, 0, 0]}>
              <meshStandardMaterial
                color={selectedFish === i ? "#ffd700" : "#fbbf24"}
                emissive={selectedFish === i ? "#ff6b00" : "#000000"}
                emissiveIntensity={selectedFish === i ? 0.3 : 0}
              />
            </Sphere>
            {/* Fish tail */}
            <Box args={[0.1, 0.15, 0.05]} position={[-0.25, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
              <meshStandardMaterial color="#f59e0b" />
            </Box>
          </group>
        ))}
      </group>

      {/* Realistic bubbles */}
      {bubbles.map((bubble) => (
        <Sphere key={bubble.id} args={[0.05 + Math.random() * 0.05, 8, 8]} position={bubble.position.toArray()}>
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.4} roughness={0.1} metalness={0.1} />
        </Sphere>
      ))}

      {/* Marine biologist avatar */}
      <HumanAvatar
        position={[4, -2, 3]}
        name="Dr. Marina"
        onInteract={() =>
          onInteraction({
            type: "expert_consultation",
            target: "marine_biologist",
            timestamp: Date.now(),
          })
        }
      />

      {/* Underwater lighting */}
      <pointLight position={[0, 2, 0]} intensity={0.8} color="#4dd0e1" />
      <pointLight position={[-5, 0, -5]} intensity={0.4} color="#26c6da" />

      <Text position={[0, 3, 0]} fontSize={0.6} color="#ffffff" fontWeight="bold">
        🌊 Deep Ocean Research Station
      </Text>

      <Html position={[0, 2, 0]} center>
        <div className="bg-blue-900 bg-opacity-80 text-white p-3 rounded-lg text-center">
          <p className="text-sm">🐠 Click on fish to learn about marine life</p>
          <p className="text-xs mt-1">💬 Talk to Dr. Marina for expert insights</p>
        </div>
      </Html>
    </>
  )
}

// Realistic Space Station with Astronauts
function RealisticSpaceEnvironment({ onInteraction }: { onInteraction: (interaction: any) => void }) {
  const stationRef = useRef<any>()
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [astronautActivity, setAstronautActivity] = useState("monitoring")

  useFrame((state) => {
    if (stationRef.current) {
      stationRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  const handleModuleClick = (moduleName: string) => {
    setSelectedModule(moduleName)
    onInteraction({
      type: "space_station_interaction",
      target: moduleName,
      timestamp: Date.now(),
      details: `Accessed ${moduleName} module systems`,
    })

    setTimeout(() => setSelectedModule(null), 3000)
  }

  const handleAstronautInteraction = () => {
    const activities = ["conducting experiments", "monitoring systems", "exercising", "communicating with Earth"]
    const newActivity = activities[Math.floor(Math.random() * activities.length)]
    setAstronautActivity(newActivity)

    onInteraction({
      type: "astronaut_interaction",
      target: "commander_alex",
      activity: newActivity,
      timestamp: Date.now(),
    })
  }

  return (
    <>
      {/* Space environment */}
      <Sky sunPosition={[0, 0, -1]} />
      <Environment preset="night" />

      {/* Earth in the background */}
      <Sphere args={[8, 32, 32]} position={[0, -15, -30]}>
        <meshStandardMaterial color="#4a90e2" emissive="#1a365d" emissiveIntensity={0.2} />
      </Sphere>

      {/* Realistic space station */}
      <group ref={stationRef}>
        {/* Main habitat module */}
        <group onClick={() => handleModuleClick("habitat_module")}>
          <Box args={[4, 1.5, 4]} position={[0, 0, 0]}>
            <meshStandardMaterial
              color={selectedModule === "habitat_module" ? "#60a5fa" : "#9ca3af"}
              metalness={0.8}
              roughness={0.2}
            />
          </Box>
          <Html position={[0, 1, 0]} center>
            <div className="bg-gray-800 text-white px-2 py-1 rounded text-xs">Habitat Module</div>
          </Html>
        </group>

        {/* Laboratory module */}
        <group onClick={() => handleModuleClick("laboratory")}>
          <Box args={[2, 1, 3]} position={[3, 0, 0]}>
            <meshStandardMaterial
              color={selectedModule === "laboratory" ? "#34d399" : "#6b7280"}
              metalness={0.8}
              roughness={0.2}
            />
          </Box>
          <Html position={[3, 1, 0]} center>
            <div className="bg-gray-800 text-white px-2 py-1 rounded text-xs">Laboratory</div>
          </Html>
        </group>

        {/* Solar panels */}
        <Box args={[0.1, 4, 8]} position={[-6, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
          <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
        </Box>
        <Box args={[0.1, 4, 8]} position={[6, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
        </Box>

        {/* Communication array */}
        <Box args={[0.2, 4, 0.2]} position={[0, 3, 0]}>
          <meshStandardMaterial color="#374151" />
        </Box>
        <Sphere args={[0.5, 16, 16]} position={[0, 4.5, 0]}>
          <meshStandardMaterial color="#4b5563" metalness={0.7} />
        </Sphere>
      </group>

      {/* Astronaut with realistic behavior */}
      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <HumanAvatar position={[2, 2, 3]} name="Commander Alex" onInteract={handleAstronautInteraction} />
      </Float>

      {/* Floating tools and equipment */}
      <Float speed={1} rotationIntensity={0.3} floatIntensity={0.5}>
        <Box args={[0.3, 0.1, 0.5]} position={[-2, 1, 2]}>
          <meshStandardMaterial color="#ef4444" />
        </Box>
      </Float>

      {/* Stars field */}
      {[...Array(200)].map((_, i) => (
        <Sphere
          key={i}
          args={[0.01, 4, 4]}
          position={[(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100]}
        >
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </Sphere>
      ))}

      {/* Realistic lighting */}
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4f46e5" />

      <Text position={[0, -4, 0]} fontSize={0.6} color="#ffffff" fontWeight="bold">
        🚀 International Space Station Alpha
      </Text>

      <Html position={[0, -5, 0]} center>
        <div className="bg-gray-900 bg-opacity-90 text-white p-3 rounded-lg text-center">
          <p className="text-sm">🛰️ Click modules to access station systems</p>
          <p className="text-xs mt-1">👨‍🚀 Commander Alex is currently: {astronautActivity}</p>
        </div>
      </Html>
    </>
  )
}

// Realistic Forest with Wildlife and NPCs
function RealisticForestEnvironment({ onInteraction }: { onInteraction: (interaction: any) => void }) {
  const treeRefs = useRef<any[]>([])
  const [wildlife, setWildlife] = useState<Array<{ id: number; type: string; position: Vector3 }>>([])
  const [selectedAnimal, setSelectedAnimal] = useState<number | null>(null)

  useEffect(() => {
    // Generate wildlife
    const animals = [
      { id: 1, type: "deer", position: new Vector3(3, 0, 4) },
      { id: 2, type: "rabbit", position: new Vector3(-2, 0, 3) },
      { id: 3, type: "bird", position: new Vector3(1, 2, -2) },
      { id: 4, type: "squirrel", position: new Vector3(-4, 1, -1) },
    ]
    setWildlife(animals)
  }, [])

  useFrame((state) => {
    // Gentle tree swaying
    treeRefs.current.forEach((tree, i) => {
      if (tree) {
        tree.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.05
        tree.children[1].rotation.y = Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.1
      }
    })
  })

  const handleAnimalClick = (animalId: number, animalType: string) => {
    setSelectedAnimal(animalId)
    onInteraction({
      type: "wildlife_observation",
      target: `${animalType}_${animalId}`,
      timestamp: Date.now(),
      details: `Observed ${animalType} in natural habitat`,
    })

    setTimeout(() => setSelectedAnimal(null), 3000)
  }

  const getAnimalComponent = (animal: any) => {
    const isSelected = selectedAnimal === animal.id
    const emissiveColor = isSelected ? "#ffd700" : "#000000"
    const emissiveIntensity = isSelected ? 0.3 : 0

    switch (animal.type) {
      case "deer":
        return (
          <group position={animal.position.toArray()} onClick={() => handleAnimalClick(animal.id, animal.type)}>
            <Box args={[0.3, 0.6, 0.8]} position={[0, 0.3, 0]}>
              <meshStandardMaterial color="#8b4513" emissive={emissiveColor} emissiveIntensity={emissiveIntensity} />
            </Box>
            <Sphere args={[0.15, 16, 16]} position={[0, 0.7, 0.3]}>
              <meshStandardMaterial color="#a0522d" emissive={emissiveColor} emissiveIntensity={emissiveIntensity} />
            </Sphere>
            {/* Antlers */}
            <Box args={[0.02, 0.3, 0.02]} position={[-0.05, 0.9, 0.3]}>
              <meshStandardMaterial color="#654321" />
            </Box>
            <Box args={[0.02, 0.3, 0.02]} position={[0.05, 0.9, 0.3]}>
              <meshStandardMaterial color="#654321" />
            </Box>
          </group>
        )
      case "rabbit":
        return (
          <group position={animal.position.toArray()} onClick={() => handleAnimalClick(animal.id, animal.type)}>
            <Sphere args={[0.15, 16, 16]} position={[0, 0.15, 0]}>
              <meshStandardMaterial color="#f5f5dc" emissive={emissiveColor} emissiveIntensity={emissiveIntensity} />
            </Sphere>
            <Sphere args={[0.1, 16, 16]} position={[0, 0.25, 0.1]}>
              <meshStandardMaterial color="#f5f5dc" emissive={emissiveColor} emissiveIntensity={emissiveIntensity} />
            </Sphere>
            {/* Ears */}
            <Box args={[0.03, 0.15, 0.08]} position={[-0.05, 0.35, 0.05]}>
              <meshStandardMaterial color="#f5f5dc" />
            </Box>
            <Box args={[0.03, 0.15, 0.08]} position={[0.05, 0.35, 0.05]}>
              <meshStandardMaterial color="#f5f5dc" />
            </Box>
          </group>
        )
      default:
        return (
          <Sphere
            args={[0.1, 16, 16]}
            position={animal.position.toArray()}
            onClick={() => handleAnimalClick(animal.id, animal.type)}
          >
            <meshStandardMaterial color="#ff6b35" emissive={emissiveColor} emissiveIntensity={emissiveIntensity} />
          </Sphere>
        )
    }
  }

  return (
    <>
      {/* Natural forest environment */}
      <Environment preset="forest" />
      <fog attach="fog" args={["#228b22", 8, 30]} />

      {/* Forest floor with natural texture */}
      <Plane args={[50, 50]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#2d5016" roughness={0.9} />
      </Plane>

      {/* Realistic trees with varying sizes */}
      {[...Array(15)].map((_, i) => (
        <group
          key={i}
          ref={(el) => (treeRefs.current[i] = el)}
          position={[(Math.random() - 0.5) * 25, 0, (Math.random() - 0.5) * 25]}
        >
          {/* Tree trunk with realistic proportions */}
          <Box
            args={[0.4 + Math.random() * 0.3, 4 + Math.random() * 2, 0.4 + Math.random() * 0.3]}
            position={[0, 2, 0]}
          >
            <meshStandardMaterial color="#8b4513" roughness={0.8} />
          </Box>

          {/* Tree canopy with multiple layers */}
          <Sphere args={[2 + Math.random(), 16, 16]} position={[0, 4.5 + Math.random(), 0]}>
            <meshStandardMaterial color="#228b22" roughness={0.7} />
          </Sphere>
          <Sphere args={[1.5 + Math.random() * 0.5, 16, 16]} position={[0, 5.5 + Math.random(), 0]}>
            <meshStandardMaterial color="#32cd32" roughness={0.7} />
          </Sphere>

          {/* Tree roots */}
          {[...Array(4)].map((_, j) => (
            <Box
              key={j}
              args={[0.2, 0.3, 0.8]}
              position={[Math.cos((j * Math.PI) / 2) * 0.6, -0.2, Math.sin((j * Math.PI) / 2) * 0.6]}
              rotation={[0, (j * Math.PI) / 2, 0]}
            >
              <meshStandardMaterial color="#654321" />
            </Box>
          ))}
        </group>
      ))}

      {/* Wildlife */}
      {wildlife.map((animal) => getAnimalComponent(animal))}

      {/* Forest ranger NPC */}
      <HumanAvatar
        position={[6, 0, 4]}
        name="Ranger Sarah"
        onInteract={() =>
          onInteraction({
            type: "ranger_consultation",
            target: "forest_ranger",
            timestamp: Date.now(),
            details: "Learned about forest conservation",
          })
        }
      />

      {/* Mushrooms and forest details */}
      {[...Array(20)].map((_, i) => (
        <group key={i} position={[(Math.random() - 0.5) * 20, 0, (Math.random() - 0.5) * 20]}>
          <Box args={[0.05, 0.2, 0.05]} position={[0, 0.1, 0]}>
            <meshStandardMaterial color="#f5deb3" />
          </Box>
          <Sphere args={[0.1, 16, 16]} position={[0, 0.25, 0]}>
            <meshStandardMaterial color="#dc143c" />
          </Sphere>
        </group>
      ))}

      {/* Fireflies for magical atmosphere */}
      {[...Array(30)].map((_, i) => (
        <Float key={i} speed={0.5 + Math.random()} rotationIntensity={0} floatIntensity={0.5}>
          <Sphere
            args={[0.02, 8, 8]}
            position={[(Math.random() - 0.5) * 15, Math.random() * 3 + 1, (Math.random() - 0.5) * 15]}
          >
            <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.8} />
          </Sphere>
        </Float>
      ))}

      {/* Natural lighting */}
      <pointLight position={[5, 8, 5]} intensity={0.6} color="#ffd700" />
      <pointLight position={[-5, 6, -5]} intensity={0.4} color="#90ee90" />

      <Text position={[0, 6, 0]} fontSize={0.6} color="#ffffff" fontWeight="bold">
        🌲 Enchanted Forest Preserve
      </Text>

      <Html position={[0, 5, 0]} center>
        <div className="bg-green-900 bg-opacity-80 text-white p-3 rounded-lg text-center">
          <p className="text-sm">🦌 Click on wildlife to observe their behavior</p>
          <p className="text-xs mt-1">🌿 Talk to Ranger Sarah about conservation</p>
        </div>
      </Html>
    </>
  )
}

// Realistic Urban Planning Environment with City Planners and Community Members
function RealisticUrbanEnvironment({ onInteraction }: { onInteraction: (interaction: any) => void }) {
  const buildingRefs = useRef<any[]>([])
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null)
  const [planningPhase, setPlanningPhase] = useState("design")
  const [communityFeedback, setCommunityFeedback] = useState<Array<{ id: number; type: string; message: string }>>([])

  useEffect(() => {
    // Generate community feedback
    const feedback = [
      { id: 1, type: "resident", message: "We need more green spaces for our children" },
      { id: 2, type: "business", message: "Better public transport connections needed" },
      { id: 3, type: "elderly", message: "More accessible walkways and ramps please" },
    ]
    setCommunityFeedback(feedback)
  }, [])

  useFrame((state) => {
    // Animate construction cranes
    buildingRefs.current.forEach((building, i) => {
      if (building && building.userData?.type === "crane") {
        building.rotation.y = Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.5
      }
    })
  })

  const handleBuildingClick = (buildingType: string) => {
    setSelectedBuilding(buildingType)
    onInteraction({
      type: "urban_planning_interaction",
      target: buildingType,
      timestamp: Date.now(),
      details: `Reviewed ${buildingType} development plans`,
    })

    setTimeout(() => setSelectedBuilding(null), 3000)
  }

  const handlePlannerInteraction = () => {
    const phases = ["design", "community_review", "environmental_assessment", "construction"]
    const currentIndex = phases.indexOf(planningPhase)
    const nextPhase = phases[(currentIndex + 1) % phases.length]
    setPlanningPhase(nextPhase)

    onInteraction({
      type: "planner_consultation",
      target: "city_planner",
      phase: nextPhase,
      timestamp: Date.now(),
    })
  }

  return (
    <>
      {/* Urban environment */}
      <Environment preset="city" />
      <fog attach="fog" args={["#87ceeb", 10, 50]} />

      {/* City ground/streets */}
      <Plane args={[60, 60]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <meshStandardMaterial color="#2c2c2c" roughness={0.8} />
      </Plane>

      {/* Street grid */}
      {[...Array(6)].map((_, i) => (
        <group key={i}>
          <Plane args={[2, 60]} rotation={[-Math.PI / 2, 0, 0]} position={[i * 10 - 25, 0, 0]}>
            <meshStandardMaterial color="#404040" />
          </Plane>
          <Plane args={[60, 2]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, i * 10 - 25]}>
            <meshStandardMaterial color="#404040" />
          </Plane>
        </group>
      ))}

      {/* Existing buildings */}
      <group>
        {/* Residential buildings */}
        <group onClick={() => handleBuildingClick("residential_complex")}>
          <Box args={[4, 8, 4]} position={[-10, 4, -10]} ref={(el) => (buildingRefs.current[0] = el)}>
            <meshStandardMaterial
              color={selectedBuilding === "residential_complex" ? "#60a5fa" : "#8b5cf6"}
              metalness={0.3}
              roughness={0.7}
            />
          </Box>
          <Html position={[-10, 9, -10]} center>
            <div className="bg-purple-800 text-white px-2 py-1 rounded text-xs">Residential Complex</div>
          </Html>
        </group>

        {/* Commercial district */}
        <group onClick={() => handleBuildingClick("commercial_center")}>
          <Box args={[6, 12, 3]} position={[8, 6, -8]}>
            <meshStandardMaterial
              color={selectedBuilding === "commercial_center" ? "#34d399" : "#10b981"}
              metalness={0.5}
              roughness={0.4}
            />
          </Box>
          <Html position={[8, 13, -8]} center>
            <div className="bg-green-800 text-white px-2 py-1 rounded text-xs">Commercial Center</div>
          </Html>
        </group>

        {/* Office buildings */}
        <group onClick={() => handleBuildingClick("office_tower")}>
          <Box args={[3, 15, 3]} position={[12, 7.5, 5]}>
            <meshStandardMaterial
              color={selectedBuilding === "office_tower" ? "#fbbf24" : "#f59e0b"}
              metalness={0.6}
              roughness={0.3}
            />
          </Box>
          <Html position={[12, 16, 5]} center>
            <div className="bg-yellow-800 text-white px-2 py-1 rounded text-xs">Office Tower</div>
          </Html>
        </group>
      </group>

      {/* Planned developments (under construction) */}
      <group>
        {/* Construction crane */}
        <group
          ref={(el) => {
            if (el) {
              el.userData = { type: "crane" }
              buildingRefs.current[1] = el
            }
          }}
        >
          <Box args={[0.5, 20, 0.5]} position={[-15, 10, 8]}>
            <meshStandardMaterial color="#ff6b35" />
          </Box>
          <Box args={[8, 0.3, 0.3]} position={[-15, 18, 8]}>
            <meshStandardMaterial color="#ff6b35" />
          </Box>
        </group>

        {/* Building under construction */}
        <group onClick={() => handleBuildingClick("sustainable_housing")}>
          <Box args={[5, 6, 4]} position={[-15, 3, 8]}>
            <meshStandardMaterial
              color={selectedBuilding === "sustainable_housing" ? "#84cc16" : "#65a30d"}
              transparent
              opacity={0.7}
            />
          </Box>
          <Html position={[-15, 7, 8]} center>
            <div className="bg-lime-800 text-white px-2 py-1 rounded text-xs">Sustainable Housing (Planned)</div>
          </Html>
        </group>
      </group>

      {/* Green spaces and parks */}
      <group>
        {/* Central park */}
        <Plane args={[12, 12]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
          <meshStandardMaterial color="#22c55e" />
        </Plane>

        {/* Trees in park */}
        {[...Array(8)].map((_, i) => (
          <group key={i} position={[(Math.random() - 0.5) * 10, 0, (Math.random() - 0.5) * 10]}>
            <Box args={[0.3, 4, 0.3]} position={[0, 2, 0]}>
              <meshStandardMaterial color="#92400e" />
            </Box>
            <Sphere args={[1.5, 16, 16]} position={[0, 4.5, 0]}>
              <meshStandardMaterial color="#16a34a" />
            </Sphere>
          </group>
        ))}

        {/* Playground equipment */}
        <Box args={[1, 0.5, 1]} position={[3, 0.25, 3]}>
          <meshStandardMaterial color="#ef4444" />
        </Box>
        <Box args={[0.2, 2, 0.2]} position={[3, 1, 3]}>
          <meshStandardMaterial color="#3b82f6" />
        </Box>
      </group>

      {/* Transportation infrastructure */}
      <group>
        {/* Bus stops */}
        {[
          [-20, 0, -5],
          [20, 0, 5],
          [5, 0, -20],
        ].map((position, i) => (
          <group key={i} position={position}>
            <Box args={[2, 3, 0.5]} position={[0, 1.5, 0]}>
              <meshStandardMaterial color="#6b7280" transparent opacity={0.7} />
            </Box>
            <Html position={[0, 3.5, 0]} center>
              <div className="bg-blue-800 text-white px-2 py-1 rounded text-xs">Bus Stop</div>
            </Html>
          </group>
        ))}

        {/* Bike lanes */}
        <Plane args={[1, 60]} rotation={[-Math.PI / 2, 0, 0]} position={[-3, 0.05, 0]}>
          <meshStandardMaterial color="#10b981" />
        </Plane>
        <Plane args={[60, 1]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, -3]}>
          <meshStandardMaterial color="#10b981" />
        </Plane>
      </group>

      {/* City planners and community members */}
      <HumanAvatar position={[5, 0, 8]} name="Architect Maya" onInteract={handlePlannerInteraction} />

      <HumanAvatar
        position={[-8, 0, 12]}
        name="Community Rep. James"
        onInteract={() =>
          onInteraction({
            type: "community_feedback",
            target: "community_representative",
            timestamp: Date.now(),
          })
        }
      />

      <HumanAvatar
        position={[15, 0, -12]}
        name="Environmental Consultant Lisa"
        onInteract={() =>
          onInteraction({
            type: "environmental_consultation",
            target: "environmental_consultant",
            timestamp: Date.now(),
          })
        }
      />

      {/* Traffic simulation */}
      <Float speed={2} rotationIntensity={0} floatIntensity={0}>
        <Box args={[2, 0.5, 1]} position={[-25, 0.5, -5]}>
          <meshStandardMaterial color="#dc2626" />
        </Box>
      </Float>

      <Float speed={1.5} rotationIntensity={0} floatIntensity={0}>
        <Box args={[1.5, 0.5, 0.8]} position={[25, 0.5, 5]}>
          <meshStandardMaterial color="#2563eb" />
        </Box>
      </Float>

      {/* Street lighting */}
      {[...Array(12)].map((_, i) => (
        <group key={i} position={[((i % 4) - 1.5) * 15, 0, Math.floor(i / 4) * 15 - 15]}>
          <Box args={[0.1, 6, 0.1]} position={[0, 3, 0]}>
            <meshStandardMaterial color="#374151" />
          </Box>
          <Sphere args={[0.3, 16, 16]} position={[0, 6, 0]}>
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.3} />
          </Sphere>
        </group>
      ))}

      {/* Urban lighting */}
      <pointLight position={[0, 15, 0]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-15, 10, -15]} intensity={0.4} color="#fbbf24" />
      <pointLight position={[15, 10, 15]} intensity={0.4} color="#60a5fa" />

      <Text position={[0, 20, 0]} fontSize={0.8} color="#ffffff" fontWeight="bold">
        🏙️ Smart City Development Project
      </Text>

      <Html position={[0, 18, 0]} center>
        <div className="bg-gray-900 bg-opacity-90 text-white p-4 rounded-lg text-center max-w-md">
          <p className="text-sm mb-2">🏗️ Click buildings to review development plans</p>
          <p className="text-xs mb-1">👥 Talk to stakeholders for different perspectives</p>
          <p className="text-xs">
            📋 Current Phase: <span className="font-bold capitalize">{planningPhase.replace("_", " ")}</span>
          </p>
        </div>
      </Html>
    </>
  )
}

// Realistic Mountain Environment with Mountaineers
function RealisticMountainEnvironment({ onInteraction }: { onInteraction: (interaction: any) => void }) {
  const [weather, setWeather] = useState("clear")
  const [altitude, setAltitude] = useState(5364) // Base camp altitude
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null)

  useEffect(() => {
    // Simulate changing weather conditions
    const weatherInterval = setInterval(() => {
      const conditions = ["clear", "cloudy", "windy", "snowing"]
      setWeather(conditions[Math.floor(Math.random() * conditions.length)])
    }, 10000)

    return () => clearInterval(weatherInterval)
  }, [])

  const handleEquipmentClick = (equipment: string) => {
    setSelectedEquipment(equipment)
    onInteraction({
      type: "equipment_inspection",
      target: equipment,
      timestamp: Date.now(),
      details: `Examined ${equipment} for mountain climbing`,
    })

    setTimeout(() => setSelectedEquipment(null), 3000)
  }

  const handleMountaineerInteraction = () => {
    onInteraction({
      type: "mountaineer_consultation",
      target: "captain_rodriguez",
      weather: weather,
      altitude: altitude,
      timestamp: Date.now(),
    })
  }

  return (
    <>
      {/* Mountain environment */}
      <Environment preset="dawn" />
      <fog attach="fog" args={["#e0e7ff", 15, 80]} />

      {/* Mountain peaks */}
      <group>
        {/* Main peak (Everest) */}
        <Box args={[20, 25, 15]} position={[0, 12.5, -30]}>
          <meshStandardMaterial color="#f8fafc" roughness={0.9} />
        </Box>

        {/* Secondary peaks */}
        <Box args={[15, 20, 12]} position={[-25, 10, -25]}>
          <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
        </Box>
        <Box args={[18, 22, 14]} position={[25, 11, -28]}>
          <meshStandardMaterial color="#f8fafc" roughness={0.9} />
        </Box>
      </group>

      {/* Base camp ground */}
      <Plane args={[40, 40]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <meshStandardMaterial color="#64748b" roughness={0.8} />
      </Plane>

      {/* Base camp tents */}
      <group>
        {/* Main expedition tent */}
        <group onClick={() => handleEquipmentClick("expedition_tent")}>
          <Box args={[3, 2, 4]} position={[-5, 0, 3]}>
            <meshStandardMaterial
              color={selectedEquipment === "expedition_tent" ? "#fbbf24" : "#f97316"}
              emissive={selectedEquipment === "expedition_tent" ? "#f97316" : "#000000"}
              emissiveIntensity={selectedEquipment === "expedition_tent" ? 0.2 : 0}
            />
          </Box>
          <Html position={[-5, 2.5, 3]} center>
            <div className="bg-orange-800 text-white px-2 py-1 rounded text-xs">Expedition Tent</div>
          </Html>
        </group>

        {/* Medical tent */}
        <group onClick={() => handleEquipmentClick("medical_tent")}>
          <Box args={[2.5, 1.8, 3]} position={[5, 0, 2]}>
            <meshStandardMaterial
              color={selectedEquipment === "medical_tent" ? "#34d399" : "#10b981"}
              emissive={selectedEquipment === "medical_tent" ? "#10b981" : "#000000"}
              emissiveIntensity={selectedEquipment === "medical_tent" ? 0.2 : 0}
            />
          </Box>
          <Html position={[5, 2.3, 2]} center>
            <div className="bg-green-800 text-white px-2 py-1 rounded text-xs">Medical Station</div>
          </Html>
        </group>

        {/* Communication tent */}
        <Box args={[2, 1.5, 2.5]} position={[0, 0, -5]}>
          <meshStandardMaterial color="#3b82f6" />
        </Box>
        <Html position={[0, 2, -5]} center>
          <div className="bg-blue-800 text-white px-2 py-1 rounded text-xs">Communications</div>
        </Html>
      </group>

      {/* Climbing equipment */}
      <group>
        {/* Oxygen tanks */}
        <group onClick={() => handleEquipmentClick("oxygen_tanks")}>
          {[...Array(4)].map((_, i) => (
            <Box key={i} args={[0.3, 1.2, 0.3]} position={[2 + i * 0.4, 0.6, 5]}>
              <meshStandardMaterial
                color={selectedEquipment === "oxygen_tanks" ? "#60a5fa" : "#3b82f6"}
                metalness={0.7}
                roughness={0.3}
              />
            </Box>
          ))}
          <Html position={[2.6, 1.8, 5]} center>
            <div className="bg-blue-800 text-white px-2 py-1 rounded text-xs">Oxygen Supply</div>
          </Html>
        </group>

        {/* Climbing ropes */}
        <group onClick={() => handleEquipmentClick("climbing_ropes")}>
          <Box args={[1, 0.5, 1]} position={[-3, 0.25, 5]}>
            <meshStandardMaterial color={selectedEquipment === "climbing_ropes" ? "#fbbf24" : "#f59e0b"} />
          </Box>
          <Html position={[-3, 1, 5]} center>
            <div className="bg-yellow-800 text-white px-2 py-1 rounded text-xs">Climbing Gear</div>
          </Html>
        </group>
      </group>

      {/* Weather effects */}
      {weather === "snowing" && (
        <>
          {[...Array(100)].map((_, i) => (
            <Float key={i} speed={2} rotationIntensity={0} floatIntensity={1}>
              <Sphere
                args={[0.02, 6, 6]}
                position={[(Math.random() - 0.5) * 50, Math.random() * 20 + 5, (Math.random() - 0.5) * 50]}
              >
                <meshStandardMaterial color="#ffffff" />
              </Sphere>
            </Float>
          ))}
        </>
      )}

      {/* Mountaineer team */}
      <HumanAvatar position={[3, 0, 8]} name="Captain Rodriguez" onInteract={handleMountaineerInteraction} />

      <HumanAvatar
        position={[-6, 0, 6]}
        name="Sherpa Pemba"
        onInteract={() =>
          onInteraction({
            type: "sherpa_consultation",
            target: "sherpa_guide",
            timestamp: Date.now(),
          })
        }
      />

      {/* Mountain lighting */}
      <pointLight position={[0, 15, 10]} intensity={0.8} color="#fbbf24" />
      <pointLight position={[-10, 8, -5]} intensity={0.4} color="#e0e7ff" />

      <Text position={[0, 8, 0]} fontSize={0.8} color="#1f2937" fontWeight="bold">
        ⛰️ Everest Base Camp - 5,364m
      </Text>

      <Html position={[0, 6, 0]} center>
        <div className="bg-slate-900 bg-opacity-90 text-white p-4 rounded-lg text-center max-w-md">
          <p className="text-sm mb-2">🏔️ Click equipment to inspect climbing gear</p>
          <p className="text-xs mb-1">
            🌤️ Current Weather: <span className="font-bold capitalize">{weather}</span>
          </p>
          <p className="text-xs">🎯 Altitude: {altitude.toLocaleString()}m above sea level</p>
        </div>
      </Html>
    </>
  )
}

// Realistic Archaeological Site with Archaeologists
function RealisticArchaeologicalEnvironment({ onInteraction }: { onInteraction: (interaction: any) => void }) {
  const [excavationPhase, setExcavationPhase] = useState("survey")
  const [discoveredArtifacts, setDiscoveredArtifacts] = useState<
    Array<{ id: number; type: string; discovered: boolean }>
  >([])
  const [selectedArtifact, setSelectedArtifact] = useState<number | null>(null)

  useEffect(() => {
    // Initialize artifacts
    const artifacts = [
      { id: 1, type: "pottery", discovered: true },
      { id: 2, type: "coin", discovered: false },
      { id: 3, type: "jewelry", discovered: true },
      { id: 4, type: "tool", discovered: false },
      { id: 5, type: "tablet", discovered: true },
    ]
    setDiscoveredArtifacts(artifacts)
  }, [])

  const handleArtifactClick = (artifactId: number, artifactType: string) => {
    setSelectedArtifact(artifactId)
    onInteraction({
      type: "artifact_analysis",
      target: `${artifactType}_${artifactId}`,
      timestamp: Date.now(),
      details: `Analyzed ${artifactType} artifact for historical significance`,
    })

    setTimeout(() => setSelectedArtifact(null), 3000)
  }

  const handleArchaeologistInteraction = () => {
    const phases = ["survey", "excavation", "analysis", "documentation"]
    const currentIndex = phases.indexOf(excavationPhase)
    const nextPhase = phases[(currentIndex + 1) % phases.length]
    setExcavationPhase(nextPhase)

    onInteraction({
      type: "archaeologist_consultation",
      target: "dr_thompson",
      phase: nextPhase,
      timestamp: Date.now(),
    })
  }

  const getArtifactComponent = (artifact: any) => {
    if (!artifact.discovered) return null

    const isSelected = selectedArtifact === artifact.id
    const emissiveColor = isSelected ? "#ffd700" : "#000000"
    const emissiveIntensity = isSelected ? 0.3 : 0

    switch (artifact.type) {
      case "pottery":
        return (
          <group
            key={artifact.id}
            position={[2, 0.3, 3]}
            onClick={() => handleArtifactClick(artifact.id, artifact.type)}
          >
            <Box args={[0.4, 0.6, 0.4]} position={[0, 0.3, 0]}>
              <meshStandardMaterial color="#92400e" emissive={emissiveColor} emissiveIntensity={emissiveIntensity} />
            </Box>
            <Html position={[0, 0.8, 0]} center>
              <div className="bg-amber-800 text-white px-2 py-1 rounded text-xs">Ancient Pottery</div>
            </Html>
          </group>
        )
      case "jewelry":
        return (
          <group
            key={artifact.id}
            position={[-2, 0.1, 2]}
            onClick={() => handleArtifactClick(artifact.id, artifact.type)}
          >
            <Sphere args={[0.15, 16, 16]} position={[0, 0.15, 0]}>
              <meshStandardMaterial
                color="#fbbf24"
                metalness={0.8}
                roughness={0.2}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
              />
            </Sphere>
            <Html position={[0, 0.5, 0]} center>
              <div className="bg-yellow-800 text-white px-2 py-1 rounded text-xs">Golden Amulet</div>
            </Html>
          </group>
        )
      case "tablet":
        return (
          <group
            key={artifact.id}
            position={[0, 0.1, 4]}
            onClick={() => handleArtifactClick(artifact.id, artifact.type)}
          >
            <Box args={[0.8, 0.1, 1.2]} position={[0, 0.05, 0]}>
              <meshStandardMaterial color="#6b7280" emissive={emissiveColor} emissiveIntensity={emissiveIntensity} />
            </Box>
            <Html position={[0, 0.4, 0]} center>
              <div className="bg-gray-800 text-white px-2 py-1 rounded text-xs">Stone Tablet</div>
            </Html>
          </group>
        )
      default:
        return null
    }
  }

  return (
    <>
      {/* Archaeological site environment */}
      <Environment preset="warehouse" />
      <fog attach="fog" args={["#d4a574", 8, 40]} />

      {/* Desert ground */}
      <Plane args={[60, 60]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#d4a574" roughness={0.9} />
      </Plane>

      {/* Ancient ruins */}
      <group>
        {/* Main temple structure */}
        <Box args={[8, 6, 6]} position={[0, 2.5, -10]}>
          <meshStandardMaterial color="#a8a29e" roughness={0.8} />
        </Box>

        {/* Columns */}
        {[...Array(4)].map((_, i) => (
          <Box key={i} args={[0.8, 5, 0.8]} position={[i * 3 - 4.5, 2, -7]}>
            <meshStandardMaterial color="#9ca3af" roughness={0.7} />
          </Box>
        ))}

        {/* Broken walls */}
        <Box args={[12, 3, 1]} position={[-8, 1, -5]}>
          <meshStandardMaterial color="#a8a29e" roughness={0.8} />
        </Box>
        <Box args={[1, 4, 8]} position={[8, 1.5, -8]}>
          <meshStandardMaterial color="#9ca3af" roughness={0.8} />
        </Box>
      </group>

      {/* Excavation sites */}
      <group>
        {/* Main dig site */}
        <Plane args={[6, 6]} rotation={[-Math.PI / 2, 0, 0]} position={[3, -0.3, 2]}>
          <meshStandardMaterial color="#8b5a2b" />
        </Plane>

        {/* Excavation grid markers */}
        {[...Array(9)].map((_, i) => (
          <Box key={i} args={[0.05, 0.5, 0.05]} position={[1 + (i % 3) * 1.5, 0.25, 0.5 + Math.floor(i / 3) * 1.5]}>
            <meshStandardMaterial color="#ef4444" />
          </Box>
        ))}

        {/* Archaeological tools */}
        <group>
          <Box args={[0.1, 0.8, 0.1]} position={[5, 0.4, 4]}>
            <meshStandardMaterial color="#92400e" />
          </Box>
          <Box args={[0.3, 0.1, 0.8]} position={[4.5, 0.05, 3.5]}>
            <meshStandardMaterial color="#6b7280" />
          </Box>
        </group>
      </group>

      {/* Discovered artifacts */}
      {discoveredArtifacts.map((artifact) => getArtifactComponent(artifact))}

      {/* Research station */}
      <group>
        <Box args={[3, 2.5, 2]} position={[-8, 1.25, 8]}>
          <meshStandardMaterial color="#8b5cf6" transparent opacity={0.8} />
        </Box>
        <Html position={[-8, 3, 8]} center>
          <div className="bg-purple-800 text-white px-2 py-1 rounded text-xs">Research Station</div>
        </Html>
      </group>

      {/* Archaeological team */}
      <HumanAvatar position={[6, 0, 6]} name="Dr. Thompson" onInteract={handleArchaeologistInteraction} />

      <HumanAvatar
        position={[-4, 0, 4]}
        name="Field Assistant Maya"
        onInteract={() =>
          onInteraction({
            type: "field_assistant_consultation",
            target: "field_assistant",
            timestamp: Date.now(),
          })
        }
      />

      <HumanAvatar
        position={[8, 0, -2]}
        name="Conservation Specialist Dr. Kim"
        onInteract={() =>
          onInteraction({
            type: "conservation_consultation",
            target: "conservation_specialist",
            timestamp: Date.now(),
          })
        }
      />

      {/* Ancient atmosphere lighting */}
      <pointLight position={[0, 12, 0]} intensity={0.9} color="#fbbf24" />
      <pointLight position={[-15, 8, -10]} intensity={0.4} color="#f97316" />

      <Text position={[0, 10, 0]} fontSize={0.8} color="#92400e" fontWeight="bold">
        🏛️ Ancient Mesopotamian Settlement
      </Text>

      <Html position={[0, 8, 0]} center>
        <div className="bg-amber-900 bg-opacity-90 text-white p-4 rounded-lg text-center max-w-md">
          <p className="text-sm mb-2">🏺 Click artifacts to analyze historical significance</p>
          <p className="text-xs mb-1">
            📋 Current Phase: <span className="font-bold capitalize">{excavationPhase}</span>
          </p>
          <p className="text-xs">🔍 Artifacts Found: {discoveredArtifacts.filter((a) => a.discovered).length}/5</p>
        </div>
      </Html>
    </>
  )
}

export default function VRInterface({ environmentType, onInteraction }: VREnvironmentProps) {
  const [isVRMode, setIsVRMode] = useState(false)
  const [userPosition, setUserPosition] = useState<[number, number, number]>([0, 1.6, 5])
  const [handTracking, setHandTracking] = useState(false)

  const renderEnvironment = () => {
    switch (environmentType) {
      case "underwater":
        return <RealisticOceanEnvironment onInteraction={onInteraction} />
      case "space":
        return <RealisticSpaceEnvironment onInteraction={onInteraction} />
      case "forest":
        return <RealisticForestEnvironment onInteraction={onInteraction} />
      case "urban":
        return <RealisticUrbanEnvironment onInteraction={onInteraction} />
      case "mountain":
        return <RealisticMountainEnvironment onInteraction={onInteraction} />
      case "archaeological":
        return <RealisticArchaeologicalEnvironment onInteraction={onInteraction} />
      default:
        return <RealisticOceanEnvironment onInteraction={onInteraction} />
    }
  }

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: userPosition, fov: 75 }} shadows gl={{ antialias: true, alpha: false }}>
        {/* Realistic lighting setup */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {renderEnvironment()}

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={25}
          minDistance={1}
          maxPolarAngle={Math.PI / 2}
          target={[0, 0, 0]}
        />
      </Canvas>

      {/* Enhanced VR Controls */}
      <div className="absolute top-4 right-4 z-10 space-y-2">
        <button
          onClick={() => setIsVRMode(!isVRMode)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors block w-full"
        >
          {isVRMode ? "Exit VR" : "🥽 Enter VR Mode"}
        </button>

        <button
          onClick={() => setHandTracking(!handTracking)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors block w-full text-sm"
        >
          {handTracking ? "👋 Hand Tracking ON" : "✋ Enable Hand Tracking"}
        </button>
      </div>

      {/* Realistic interaction guide */}
      <div className="absolute bottom-4 left-4 z-10 bg-black bg-opacity-70 text-white p-4 rounded-lg max-w-sm">
        <h3 className="font-bold mb-2">🎮 Natural Interactions</h3>
        <div className="text-sm space-y-1">
          <p>
            👀 <strong>Look around:</strong> Move mouse to explore
          </p>
          <p>
            🖱️ <strong>Interact:</strong> Click on people, animals, objects
          </p>
          <p>
            🔍 <strong>Zoom:</strong> Scroll wheel to get closer
          </p>
          <p>
            💬 <strong>Talk:</strong> Click on NPCs for conversations
          </p>
          <p>
            🎯 <strong>Observe:</strong> Watch realistic behaviors and animations
          </p>
        </div>
      </div>

      {/* Immersion indicator */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-green-600 bg-opacity-80 text-white px-3 py-2 rounded-lg text-sm">
          🌟 Immersion Level: High
        </div>
      </div>
    </div>
  )
}
