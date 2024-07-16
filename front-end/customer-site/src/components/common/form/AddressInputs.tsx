import React from "react";

interface AddressinputsProps {
  addressProps: any;
  setAddressProps: (propName: string, value: string) => void;
  disabled: boolean;
}

const Addressinputs = ({
  addressProps,
  setAddressProps,
  disabled,
}: AddressinputsProps) => {
  const { phone, address } = addressProps;
  return (
    <>
      <label> Phone number</label>
      <input
        type="tel"
        placeholder="Phone number"
        pattern="[0-9]{10}"
        disabled={disabled}
        value={phone ?? ""}
        onChange={(e) => setAddressProps("phone", e.target.value)}
        className="input"
      />
      <label> Address</label>
      <input
        type="text"
        placeholder="Address"
        disabled={disabled}
        value={address ?? ""}
        onChange={(e) => setAddressProps("address", e.target.value)}
        className="input"
      />
    </>
  );
};

export default Addressinputs;
