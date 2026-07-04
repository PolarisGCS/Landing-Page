# Upcoming Features

What's next for PolarisGCS, starting with a new module in active development.

## Built for Claude: Life Sciences

This feature is being built for the **[Claude: Life Sciences](https://cerebralvalley.ai/e/built-with-claude-life-sciences)** hackathon, hosted by Cerebral Valley. It's an early look at a capability that isn't live in PolarisGCS yet.

---

## Vector Sentinel: finding mosquito breeding sites before they become an outbreak

**The statistic:** dengue cases reported worldwide jumped from about 500,000 in the year 2000 to over 5.2 million in 2019, according to the World Health Organization — a more than tenfold increase in under twenty years. Malaria still causes over 600,000 deaths a year. Both diseases spread through mosquitoes, and mosquitoes need one specific thing to breed: standing water.

**What it is:** Vector Sentinel is a new mission type for PolarisGCS that turns a drone fleet into an automated water-body scout. Drones fly a search pattern over a neighborhood or field site, take photos as they go, and an AI vision system spots ponds, puddles, clogged drains, and other pools of standing water in those photos — the exact places mosquitoes lay their eggs.

**The problem it solves:** right now, finding these breeding sites means a person walking the area on foot, block by block, which is slow, easy to miss spots with (a blocked drain behind a building, a puddle in a back lot), and hard to repeat often enough to catch new water before it breeds a new generation of mosquitoes. Standing water can appear after a single rainstorm and disappear a week later, so a one-time survey is never enough.

**How PolarisGCS helps:** the drones we already fly and track today do the legwork instead of a person. Each spotted water body gets logged, given a risk score (a big stagnant pool near houses scores higher than a small puddle that's likely to dry up), and tracked over repeated flights so the system can tell you a site is "growing" or "drying up." The standout piece is that Claude acts as the mission's co-pilot while the drones are still in the air: if it sees a high-risk site pop up mid-flight, it can redirect a drone for a closer look or bring in another drone to help cover a busy zone — all on its own, and every decision comes with a plain-English reason ("this puddle hasn't shrunk in three surveys and sits right next to a housing block, sending Drone 2 in for a closer pass"). At the end of a flight, it writes a short report a health department can act on directly: which sites to treat first, and why.

No new hardware, no medical expertise required to read the results — just the drones PolarisGCS already flies, pointed at a problem with a clear, well-established fix: find the water, treat it, before it breeds.
