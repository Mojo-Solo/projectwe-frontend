"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface JourneyNode {
  id: string;
  label: string;
  count: number;
  avgTime?: number;
}

interface JourneyLink {
  source: string;
  target: string;
  value: number;
  dropoff?: number;
}

interface UserJourneyMapProps {
  nodes: JourneyNode[];
  links: JourneyLink[];
}

export function UserJourneyMap({ nodes, links }: UserJourneyMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    // Set dimensions
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Create scales
    const xScale = d3
      .scalePoint<string>()
      .domain(nodes.map((n) => n.id))
      .range([margin.left + 50, width - margin.right - 50]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(nodes, (d) => d.count) || 0])
      .range([height - margin.bottom, margin.top]);

    // Create gradients for links
    const defs = svg.append("defs");

    links.forEach((link, i) => {
      const gradient = defs
        .append("linearGradient")
        .attr("id", `gradient-${i}`)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");

      gradient
        .append("stop")
        .attr("offset", "0%")
        .style("stop-color", "#8b5cf6")
        .style("stop-opacity", 0.8);

      gradient
        .append("stop")
        .attr("offset", "100%")
        .style("stop-color", "#3b82f6")
        .style("stop-opacity", 0.6);
    });

    // Draw links
    const linkGroup = svg.append("g").attr("class", "links");

    links.forEach((link, i) => {
      const sourceNode = nodes.find((n) => n.id === link.source);
      const targetNode = nodes.find((n) => n.id === link.target);

      if (!sourceNode || !targetNode) return;

      const linkPath = linkGroup
        .append("path")
        .attr("d", () => {
          const sx = xScale(link.source) || 0;
          const sy = height / 2;
          const tx = xScale(link.target) || 0;
          const ty = height / 2;
          const midX = (sx + tx) / 2;

          return `M ${sx} ${sy} Q ${midX} ${sy - 50} ${tx} ${ty}`;
        })
        .attr("fill", "none")
        .attr("stroke", `url(#gradient-${i})`)
        .attr("stroke-width", Math.max(2, link.value / 20))
        .attr("opacity", 0.6);

      // Add flow animation
      linkPath
        .attr("stroke-dasharray", "5 5")
        .attr("stroke-dashoffset", 0)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", -10)
        .on("end", function repeat() {
          d3.select(this)
            .attr("stroke-dashoffset", 0)
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", -10)
            .on("end", repeat);
        });
    });

    // Draw nodes
    const nodeGroup = svg.append("g").attr("class", "nodes");

    const nodeElements = nodeGroup
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${xScale(d.id)}, ${height / 2})`);

    // Node circles
    nodeElements
      .append("circle")
      .attr("r", (d) => Math.max(20, Math.sqrt(d.count) * 2))
      .attr("fill", "#6366f1")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", Math.max(25, Math.sqrt(d.count) * 2.5));

        // Show tooltip
        const tooltip = d3
          .select("body")
          .append("div")
          .attr("class", "tooltip")
          .style("position", "absolute")
          .style("background", "rgba(0, 0, 0, 0.8)")
          .style("color", "white")
          .style("padding", "8px")
          .style("border-radius", "4px")
          .style("font-size", "12px")
          .style("pointer-events", "none")
          .style("opacity", 0);

        tooltip
          .html(
            `
          <strong key={index}>${d.label}</strong><br>
          Users: ${d.count}<br>
          ${d.avgTime ? `Avg Time: ${d.avgTime}s` : ""}
        `,
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px")
          .transition()
          .duration(200)
          .style("opacity", 1);
      })
      .on("mouseout", function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", Math.max(20, Math.sqrt(d.count) * 2));

        d3.selectAll(".tooltip").remove();
      });

    // Node labels
    nodeElements
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", -30)
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text((d) => d.label);

    // Node counts
    nodeElements
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", 5)
      .style("font-size", "16px")
      .style("fill", "white")
      .style("font-weight", "bold")
      .text((d) => d.count);

    // Dropoff indicators
    links.forEach((link) => {
      if (link.dropoff && link.dropoff > 10) {
        const sourceX = xScale(link.source) || 0;
        const targetX = xScale(link.target) || 0;
        const midX = (sourceX + targetX) / 2;

        svg
          .append("text")
          .attr("x", midX)
          .attr("y", height / 2 - 60)
          .attr("text-anchor", "middle")
          .style("font-size", "12px")
          .style("fill", "#ef4444")
          .text(`-${link.dropoff}%`);
      }
    });
  }, [nodes, links]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Journey Map</CardTitle>
        <CardDescription>
          Visualize how users navigate through your platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <svg ref={svgRef}></svg>
        </div>
      </CardContent>
    </Card>
  );
}
