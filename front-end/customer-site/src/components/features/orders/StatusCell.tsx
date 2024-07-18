import { Chip } from "@nextui-org/react";

type StatusColor =
  | "warning"
  | "success"
  | "default"
  | "primary"
  | "info"
  | "danger";

const OrderStatusCell = ({ status }: { status: number }) => {
  let statusLabel = "";
  let statusColor: StatusColor = "default"; // Default value to handle unknown cases

  switch (status) {
    case 0:
      statusLabel = "Pending";
      statusColor = "warning";
      break;
    case 1:
      statusLabel = "Paid";
      statusColor = "success";
      break;
    case 2:
      statusLabel = "Waiting";
      statusColor = "default";
      break;
    case 3:
      statusLabel = "Delivered";
      statusColor = "success";
      break;
    case 4:
      statusLabel = "Accepted";
      statusColor = "success";
      break;
    case 5:
      statusLabel = "Cancelled";
      statusColor = "danger";
      break;
    default:
      statusLabel = "Unknown";
      break;
  }

  return (
    <Chip className="capitalize" color={statusColor} size="md" variant="flat">
      {statusLabel}
    </Chip>
  );
};

export default OrderStatusCell;
