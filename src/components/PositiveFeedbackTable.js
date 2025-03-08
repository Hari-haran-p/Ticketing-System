"use client"

import { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Search, ArrowUp, ArrowDown } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function PositiveFeedbackTable({ data }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState([])
  const [sortColumn, setSortColumn] = useState(null)
  const [sortDirection, setSortDirection] = useState("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const categories = Array.from(new Set(data.map((item) => item.category_name)))

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedData = useMemo(() => {
    if (!sortColumn) return data

    return [...data].sort((a, b) => {
      const valueA = a[sortColumn]?.toString().toLowerCase() || ""
      const valueB = b[sortColumn]?.toString().toLowerCase() || ""

      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [data, sortColumn, sortDirection])

  const filteredData = useMemo(() => {
    return sortedData.filter((item) => {
      const matchesSearch = Object.values(item).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchTerm.toLowerCase())
      )

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(item.category_name)

      return matchesSearch && matchesCategory
    })
  }, [sortedData, searchTerm, selectedCategories])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredData.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredData, currentPage, itemsPerPage])

  const getQuestionContent = (item) => {
    if (item.category_eng_question) {
      return (
        <>
          <div>{item.category_eng_question}</div>
          <div className="text-sm text-muted-foreground">{item.category_tamil_question}</div>
        </>
      )
    } else if (item.parameter_eng_question) {
      return (
        <>
          <div>{item.parameter_eng_question}</div>
          <div className="text-sm text-muted-foreground">{item.parameter_tamil_question}</div>
        </>
      )
    } else {
      return <div>No Question</div> // Or some other placeholder
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[180px]">
              Categories <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            {categories.map((category) => (
              <DropdownMenuCheckboxItem
                key={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => {
                  setSelectedCategories((prev) =>
                    checked
                      ? [...prev, category]
                      : prev.filter((c) => c !== category)
                  )
                  setCurrentPage(1)
                }}
              >
                {category}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {[
                { key: "user_name", label: "User" },
                { key: "asset_name", label: "Asset" },
                { key: "asset_address", label: "Address" },
                { key: "category_name", label: "Category" },
                { key: "question", label: "Question" },
                { key: "user_response", label: "Response" },
                { key: "feedback_date", label: "Date" },
              ].map((col) => (
                <TableHead
                  key={col.key}
                  className="cursor-pointer"
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                  {sortColumn === col.key ? (
                    sortDirection === "asc" ? (
                      <ArrowUp className="ml-2 h-4 w-4 inline-block" />
                    ) : (
                      <ArrowDown className="ml-2 h-4 w-4 inline-block" />
                    )
                  ) : (
                    <ChevronDown className="ml-2 h-4 w-4 inline-block" />
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="font-medium">{item.user_name}</div>
                    <div className="text-sm text-muted-foreground">{item.user_mobile}</div>
                  </TableCell>
                  <TableCell>{item.asset_name}</TableCell>
                  <TableCell>{item.asset_address}</TableCell>
                  <TableCell>{item.category_name}</TableCell>
                  <TableCell>
                    {getQuestionContent(item)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.user_response === "Yes" ? "success" : "destructive"}>
                      {item.user_response}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(item.feedback_date).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-4">
        <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} variant="outline">
          Previous
        </Button>

        <Select value={String(itemsPerPage)} onValueChange={(value) => {
          setItemsPerPage(Number(value))
          setCurrentPage(1)
        }}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Items per page" />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20, 50].map((num) => (
              <SelectItem key={num} value={String(num)}>{num}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <Button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} variant="outline">
          Next
        </Button>
      </div>
    </div>
  )
}