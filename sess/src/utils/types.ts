  export enum TokenTypeEnum {
    CONFIRMATION,
    RESET,
  }
  
  export enum UserRoleEnum {
    REGULAR,
    ADMIN
  }

  export enum ConversationTypeEnum {
    REGULAR,
    GROUP
  }
  export enum MessageTypeEnum {
    TEXT,
    IMAGE
  }

  export enum ConfirmationStatusEnum {
    FOREIGN,
    REMAINING,
    CONFIRMED,
    REJECTED
  }

  export enum MessagesQueryTypeEnum {
    DAY,
    MONTH,
    YEAR
  }

  export enum RelationshipType {
    FOREIGN,
    INVITED,
    FRIEND,
    REJECTED
  }