// dataset.ts
import { OrganizationData, AgentDetails, BillingRecord } from './types';

export const mockOrgDataMap: Record<string, OrganizationData> = {
  "1234567890": {
    "orgId": "1234567890",
    "orgName": "Casagrand",
    "orgStatus": "ACTIVE",
    "orgLogo": "https://www.casagrand.co.in/wp-content/uploads/2021/07/Casagrand-Logo1.png",
    "orgMembers": [
      {
        "memberId": "a2293765",
        "memberName": "Admin",
        "memberEmail": "admin@gmail.com",
        "memberPassword": "12345",
        "memberStatus": "active",
        "role": ["admin"],
        "created_at": "2025-07-10T15:07:24.165+00:00",
        "updated_at": "2025-07-10T15:07:24.165+00:00"
      },
      {
        "memberId": "b1234567",
        "memberName": "Manager",
        "memberEmail": "manager@casagrand.in",
        "memberPassword": "manager123",
        "memberStatus": "active",
        "role": ["manager"],
        "created_at": "2025-07-11T09:20:15.100+00:00",
        "updated_at": "2025-07-11T09:20:15.100+00:00"
      },
      {
        "memberId": "c7654321",
        "memberName": "Support",
        "memberEmail": "support@casagrand.in",
        "memberPassword": "support321",
        "memberStatus": "inactive",
        "role": ["support"],
        "created_at": "2025-07-12T12:30:00.000+00:00",
        "updated_at": "2025-07-12T12:30:00.000+00:00"
      }
    ],
    "orgSupportAccess": [
      "Dashboard",
      "Campaign",
      "Agent",
      "Profile"
    ],
    "orgAdminAccess": [
      "dashboard",
      "campaign",
      "bot-agents",
      "human-agents",
      "teamManagement",
      "payment-usage",
      "payments",
      "profile",
      "analytics",
      "settings",
      "callData",
      "call-history",
      "agentCallLog",
      "agentCallHistory",
      "agentNumber"
    ],
    "orgCollectionAccess": [
      "Dashboard",
      "Agent",
      "Profile",
      "Teams",
      "Payments"
    ]
  },
  "1234567891": {
    "orgId": "1234567891",
    "orgName": "TVK",
    "orgStatus": "ACTIVE",
    "orgLogo": "https://i.postimg.cc/MpMN6kqp/download.png",
    "orgMembers": [
      {
        "memberId": "tvk001",
        "memberName": "TVK Admin",
        "memberEmail": "admin@tvk.in",
        "memberPassword": "tvk@2025",
        "memberStatus": "active",
        "role": ["admin"],
        "created_at": "2025-01-15T10:30:00.000+00:00",
        "updated_at": "2025-01-15T10:30:00.000+00:00"
      },
      {
        "memberId": "tvk002",
        "memberName": "Campaign Manager",
        "memberEmail": "campaign@tvk.in",
        "memberPassword": "campaign123",
        "memberStatus": "active",
        "role": ["manager", "campaign"],
        "created_at": "2025-01-20T14:15:30.000+00:00",
        "updated_at": "2025-01-20T14:15:30.000+00:00"
      },
      {
        "memberId": "tvk003",
        "memberName": "Social Media Lead",
        "memberEmail": "social@tvk.in",
        "memberPassword": "social456",
        "memberStatus": "active",
        "role": ["social_media"],
        "created_at": "2025-02-01T09:45:00.000+00:00",
        "updated_at": "2025-02-01T09:45:00.000+00:00"
      },
      {
        "memberId": "tvk004",
        "memberName": "Data Analyst",
        "memberEmail": "data@tvk.in",
        "memberPassword": "data789",
        "memberStatus": "active",
        "role": ["analyst"],
        "created_at": "2025-02-10T11:20:00.000+00:00",
        "updated_at": "2025-02-10T11:20:00.000+00:00"
      },
      {
        "memberId": "tvk005",
        "memberName": "Field Coordinator",
        "memberEmail": "field@tvk.in",
        "memberPassword": "field321",
        "memberStatus": "inactive",
        "role": ["coordinator"],
        "created_at": "2025-03-01T16:00:00.000+00:00",
        "updated_at": "2025-03-01T16:00:00.000+00:00"
      }
    ],
    "orgSupportAccess": [
      "Dashboard",
      "Campaign",
      "Voter Database",
      "Events",
      "Reports"
    ],
    "orgAdminAccess": [
      "dashboard",
      "campaign-management",
      "voter-database",
      "event-management",
      "volunteer-management",
      "donation-tracking",
      "social-media",
      "analytics",
      "reports",
      "settings",
      "user-management",
      "constituency-data",
      "poll-monitoring",
      "media-center",
      "feedback-system"
    ],
    "orgCollectionAccess": [
      "Dashboard",
      "Campaigns",
      "Voter Data",
      "Events",
      "Donations",
      "Reports"
    ]
  }
};

export const agentData: Record<string, AgentDetails[]> = {
  "1234567890": [
    {
    orgId: "1234567890",
    agentName: "Real Estate Agent",
    agentDescription: "Real Estate Agent agentDescription",
    memberId: "b9f38a65-f4ee-4929-8fcc-8dc4c3f3d93b",
    agentId: "SPRT001",
    createdBy: "b9f38a65-f4ee-4929-8fcc-8dc4c3f3d93b",
    phoneNumbers: [
        {
        agentId: "a01",
        agentNo: "001",
        status: "ACTIVE",
        totalCalls: 100,
        answered: 75,
        missed: 25,
        averageDur: 120
        },
        {
        agentId: "a02",
        agentNo: "002",
        status: "ACTIVE",
        totalCalls: 80,
        answered: 60,
        missed: 20,
        averageDur: 110
        },
        {
        agentId: "a03",
        agentNo: "003",
        status: "INACTIVE",
        totalCalls: 60,
        answered: 50,
        missed: 10,
        averageDur: 100
        },
        {
        agentId: "a04",
        agentNo: "004",
        status: "ACTIVE",
        totalCalls: 90,
        answered: 72,
        missed: 18,
        averageDur: 115
        },
        {
        agentId: "a05",
        agentNo: "005",
        status: "ACTIVE",
        totalCalls: 70,
        answered: 50,
        missed: 20,
        averageDur: 105
        }
    ],
    agentStatus: "ACTIVE",
    createdAt: "2025-07-09T15:44:45.948+00:00",
    updatedAt: "2025-07-09T15:44:45.948+00:00"
    },
    {
    orgId: "1234567890",
    agentName: "Support Agent",
    agentDescription: "Agent agentDescription",
    memberId: "b9f38a65-f4ee-4929-8fcc-8dc4c3f3d93b",
    agentId: "SPRT002",
    createdBy: "b9f38a65-f4ee-4929-8fcc-8dc4c3f3d93b",
    phoneNumbers: [],
    agentStatus: "ACTIVE",
    createdAt: "2025-07-09T15:44:45.948+00:00",
    updatedAt: "2025-07-09T15:44:45.948+00:00"
    }]
}

export const billingData: Record<string, BillingRecord> = {
  "1234567890": {
    orgId: "1234567890",
    orgName: "Casagrand",
    invoices: [
      {
        invoiceId: "INV-CASA-2025-05",
        billingPeriod: "May 2025",
        amount: 4999,
        status: "PAID",
        generatedAt: "2025-05-01T09:00:00.000Z",
        dueDate: "2025-05-10T00:00:00.000Z",
        paidAt: "2025-05-05T14:00:00.000Z",
        paymentMethod: "UPI",
        callSummary: {
          startDate: "2025-05-01",
          endDate: "2025-05-31",
          totalCalls: 2541,
          totalMinutes: 7410,
          totalCost: 989.32,
          avgCostPerCall: 0.39,
          avgCostPerMinute: 0.133
        }
      },
      {
        invoiceId: "INV-CASA-2025-06",
        billingPeriod: "June 2025",
        amount: 4999,
        status: "PAID",
        generatedAt: "2025-06-01T09:00:00.000Z",
        dueDate: "2025-06-10T00:00:00.000Z",
        paidAt: "2025-06-07T11:30:00.000Z",
        paymentMethod: "Card",
        callSummary: {
          startDate: "2025-06-01",
          endDate: "2025-06-30",
          totalCalls: 2847,
          totalMinutes: 8541,
          totalCost: 1138.40,
          avgCostPerCall: 0.40,
          avgCostPerMinute: 0.133
        }
      },
      {
        invoiceId: "INV-CASA-2025-07",
        billingPeriod: "July 2025",
        amount: 4999,
        status: "PENDING",
        generatedAt: "2025-07-01T09:00:00.000Z",
        dueDate: "2025-07-10T00:00:00.000Z",
        callSummary: {
          startDate: "2025-07-01",
          endDate: "2025-07-15",
          totalCalls: 1404,
          totalMinutes: 3902,
          totalCost: 521.33,
          avgCostPerCall: 0.37,
          avgCostPerMinute: 0.134
        }
      }
    ]
  },

  "1234567891": {
    orgId: "1234567891",
    orgName: "TVK",
    invoices: [
      {
        invoiceId: "INV-TVK-2025-05",
        billingPeriod: "May 2025",
        amount: 7499,
        status: "PAID",
        generatedAt: "2025-05-01T09:30:00.000Z",
        dueDate: "2025-05-10T00:00:00.000Z",
        paidAt: "2025-05-03T10:45:00.000Z",
        paymentMethod: "BankTransfer",
        callSummary: {
          startDate: "2025-05-01",
          endDate: "2025-05-31",
          totalCalls: 3010,
          totalMinutes: 8990,
          totalCost: 1215.50,
          avgCostPerCall: 0.40,
          avgCostPerMinute: 0.135
        }
      },
      {
        invoiceId: "INV-TVK-2025-06",
        billingPeriod: "June 2025",
        amount: 7499,
        status: "OVERDUE",
        generatedAt: "2025-06-01T09:30:00.000Z",
        dueDate: "2025-06-10T00:00:00.000Z",
        callSummary: {
          startDate: "2025-06-01",
          endDate: "2025-06-30",
          totalCalls: 3280,
          totalMinutes: 9782,
          totalCost: 1320.25,
          avgCostPerCall: 0.40,
          avgCostPerMinute: 0.135
        }
      },
      {
        invoiceId: "INV-TVK-2025-07",
        billingPeriod: "July 2025",
        amount: 7499,
        status: "PENDING",
        generatedAt: "2025-07-01T09:30:00.000Z",
        dueDate: "2025-07-10T00:00:00.000Z",
        callSummary: {
          startDate: "2025-07-01",
          endDate: "2025-07-15",
          totalCalls: 1599,
          totalMinutes: 4832,
          totalCost: 657.34,
          avgCostPerCall: 0.41,
          avgCostPerMinute: 0.136
        }
      }
    ]
  }
};
