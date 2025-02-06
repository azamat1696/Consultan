"use client"
import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Chip,
  Input,
  Pagination,
} from "@heroui/react";
import { SearchIcon } from "@/components/icons";
import { getLogs } from "./actions";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { toast } from "react-hot-toast";


type LogType = "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "ERROR";

interface Log {
  id: number;
  type: LogType;
  action: string;
  description: string | null;
  createdAt: Date;
  user: { name: string | null } | null;
  ip: string | null;
}

type SortDirection = "asc" | "desc";

const typeColors = {
  CREATE: "success",
  UPDATE: "warning",
  DELETE: "danger",
  LOGIN: "primary",
  LOGOUT: "default",
  ERROR: "danger",
} as const;

export default function LogsPage() {
  const [logs, setLogs] = React.useState<Log[]>([]);
  const [filterValue, setFilterValue] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);

  const sortLogs = (logs: Log[]) => {
    return [...logs].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
  };

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const { data, totalPages: pages } = await getLogs({ 
        page, 
        perPage: 10,
        search: filterValue 
      });
      setLogs(data);
      setTotalPages(pages);
    } catch (error) {
      toast.error("Loglar yüklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchLogs();
  }, [page, filterValue]);

  const onSearchChange = (value: string) => {
    setFilterValue(value);
    setPage(1);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sistem Logları</h1>
        <Input
          isClearable
          className="w-full max-w-xs"
          placeholder="Log ara..."
          startContent={<SearchIcon />}
          value={filterValue}
          onClear={() => onSearchChange("")}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <Table onLoad={fetchLogs}    >
        <TableHeader>
          <TableColumn 
            className="cursor-pointer hover:text-primary"
          >
            Tarih
          </TableColumn>
          <TableColumn>Kullanıcı</TableColumn>
          <TableColumn>Tip</TableColumn>
          <TableColumn>İşlem</TableColumn>
          <TableColumn>Açıklama</TableColumn>
          <TableColumn>IP</TableColumn>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                {
                  // @ts-ignore
                format(new Date(log.createdAt), "dd MMMM yyyy HH:mm", { locale: tr })
                }
              </TableCell>
              <TableCell>{log.user?.name || "-"}</TableCell>
              <TableCell>
                <Chip color={typeColors[log.type]} variant="flat" size="sm">
                  {log.type}
                </Chip>
              </TableCell>
              <TableCell>{log.action}</TableCell>
              <TableCell>{log.description}</TableCell>
              <TableCell>{log.ip}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center mt-4">
        <Pagination
          total={totalPages}
          page={page}
          onChange={setPage}
        />
      </div>
    </div>
  );
} 