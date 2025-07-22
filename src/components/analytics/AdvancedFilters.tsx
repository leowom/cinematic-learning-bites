import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Download, Filter, RotateCcw } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  onExport: (format: 'csv' | 'pdf') => void;
}

export interface FilterState {
  dateRange: DateRange | undefined;
  course: string;
  userRole: string;
  completionStatus: string;
  timeframe: string;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ onFiltersChange, onExport }) => {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: undefined,
    course: 'all',
    userRole: 'all',
    completionStatus: 'all',
    timeframe: '30d'
  });

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFiltersChange(updated);
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      dateRange: undefined,
      course: 'all',
      userRole: 'all',
      completionStatus: 'all',
      timeframe: '30d'
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  return (
    <Card className="analytics-container bg-white/10 backdrop-blur-sm border-white/20 mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-white" />
            <h3 className="text-lg font-semibold text-white">Advanced Filters</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-white hover:bg-white/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left font-normal bg-white/5 border-white/20 text-white hover:bg-white/10"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {filters.dateRange?.from ? (
                  filters.dateRange.to ? (
                    <>
                      {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                      {format(filters.dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(filters.dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={filters.dateRange?.from}
                selected={filters.dateRange}
                onSelect={(range) => updateFilters({ dateRange: range })}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {/* Course Filter */}
          <Select value={filters.course} onValueChange={(value) => updateFilters({ course: value })}>
            <SelectTrigger className="bg-white/5 border-white/20 text-white">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="prompting">Prompt Engineering</SelectItem>
              <SelectItem value="ai-fundamentals">AI Fundamentals</SelectItem>
              <SelectItem value="advanced-ai">Advanced AI</SelectItem>
            </SelectContent>
          </Select>

          {/* User Role Filter */}
          <Select value={filters.userRole} onValueChange={(value) => updateFilters({ userRole: value })}>
            <SelectTrigger className="bg-white/5 border-white/20 text-white">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="student">Students</SelectItem>
              <SelectItem value="instructor">Instructors</SelectItem>
              <SelectItem value="admin">Administrators</SelectItem>
            </SelectContent>
          </Select>

          {/* Completion Status Filter */}
          <Select value={filters.completionStatus} onValueChange={(value) => updateFilters({ completionStatus: value })}>
            <SelectTrigger className="bg-white/5 border-white/20 text-white">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="not-started">Not Started</SelectItem>
            </SelectContent>
          </Select>

          {/* Timeframe Filter */}
          <Select value={filters.timeframe} onValueChange={(value) => updateFilters({ timeframe: value })}>
            <SelectTrigger className="bg-white/5 border-white/20 text-white">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Export Actions */}
        <div className="flex items-center gap-4">
          <span className="text-white/80 text-sm">Export Data:</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onExport('csv')}
            className="bg-white/5 border-white/20 text-white hover:bg-white/10"
          >
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onExport('pdf')}
            className="bg-white/5 border-white/20 text-white hover:bg-white/10"
          >
            <Download className="w-4 h-4 mr-2" />
            PDF Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedFilters;