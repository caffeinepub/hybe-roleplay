import Principal "mo:core/Principal";

actor {
  type Creator = {
    name : Text;
    description : Text;
  };

  type Element = {
    name : Text;
    description : Text;
  };

  type InventoryItem = {
    name : Text;
    description : Text;
  };

  type Event = {
    name : Text;
    description : Text;
  };

  public shared ({ caller }) func initialize(_owner : Principal) : async () {
    ();
  };
};
