import * as React from "react";
import { CheckIcon, X as XIcon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils"; // your className helper
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Option = {
  value: string;
  label: string;
};

interface SearchSelectProps {
  options: Option[];
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export const SearchSelect: React.FC<SearchSelectProps> = ({
  options,
  placeholder = "Select...",
  value = "",
  onValueChange,
  className,
}) => {
  const [selectedValue, setSelectedValue] = React.useState<string>(value);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleSelect = (val: string) => {
    setSelectedValue(val);
    onValueChange?.(val);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedValue("");
    onValueChange?.("");
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          type="button"
          className={cn(
            "flex h-11 w-full items-center justify-between p-1 [&_svg]:pointer-events-auto",
            className
          )}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {selectedValue ? (
            <div className="flex items-center justify-between w-full px-3 text-foreground overflow-hidden">
              <p className="truncate text-left flex-1 min-w-0">
                {options.find((o) => o.value === selectedValue)?.label}
              </p>
              <div className="flex items-center flex-shrink-0">
                <XIcon
                  className="mx-1 h-4 cursor-pointer text-muted-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                />
                <Separator
                  orientation="vertical"
                  className="flex h-full min-h-6 mx-1"
                />
                <ChevronDown className="h-4 cursor-pointer text-muted-foreground" />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full mx-auto px-3 text-sm text-muted-foreground">
              {placeholder}
              <ChevronDown className="h-4 cursor-pointer text-muted-foreground" />
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-auto p-0", className)} align="start">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className="max-h-[20rem] overflow-y-auto">
              {options.map((opt) => {
                const isSelected = opt.value === selectedValue;
                return (
                  <CommandItem
                    key={opt.value}
                    onSelect={() => handleSelect(opt.value)}
                    className="cursor-pointer"
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center",
                        isSelected ? "text-primary" : "invisible"
                      )}
                    >
                      <CheckIcon className="w-4 h-4" />
                    </div>
                    <span>{opt.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <div className="flex items-center justify-between">
                {selectedValue && (
                  <CommandItem
                    onSelect={handleClear}
                    className="justify-center flex-1 cursor-pointer"
                  >
                    Clear
                  </CommandItem>
                )}
                <CommandItem
                  onSelect={() => setIsOpen(false)}
                  className="justify-center flex-1 cursor-pointer"
                >
                  Close
                </CommandItem>
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
