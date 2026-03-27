import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Time "mo:base/Time";

actor {
  public type AuditionResponse = {
    id: Nat;
    roleplayName: Text;
    dob: Text;
    faceClaim: Text;
    contactNumber: Text;
    membershipStatus: Text;
    groupName: Text;
    roleName: Text;
    timestamp: Int;
  };

  stable var _owner: Principal = Principal.fromText("aaaaa-aa");
  stable var responses: [AuditionResponse] = [];
  stable var nextId: Nat = 1;
  stable var groupsJson: Text = "";
  stable var rulesJson: Text = "";

  public func initialize(owner: Principal): async () {
    _owner := owner;
  };

  public func submitResponse(
    roleplayName: Text,
    dob: Text,
    faceClaim: Text,
    contactNumber: Text,
    membershipStatus: Text,
    groupName: Text,
    roleName: Text
  ): async Nat {
    let id = nextId;
    nextId += 1;
    let r: AuditionResponse = {
      id;
      roleplayName;
      dob;
      faceClaim;
      contactNumber;
      membershipStatus;
      groupName;
      roleName;
      timestamp = Time.now();
    };
    responses := Array.append(responses, [r]);
    id
  };

  public query func getResponses(): async [AuditionResponse] {
    responses
  };

  public func deleteResponse(id: Nat): async ?AuditionResponse {
    var deleted: ?AuditionResponse = null;
    responses := Array.filter<AuditionResponse>(responses, func(r) {
      if (r.id == id) {
        deleted := ?r;
        false
      } else {
        true
      }
    });
    deleted
  };

  public func setGroups(json: Text): async () {
    groupsJson := json;
  };

  public query func getGroups(): async Text {
    groupsJson
  };

  public func setRules(json: Text): async () {
    rulesJson := json;
  };

  public query func getRules(): async Text {
    rulesJson
  };
};
