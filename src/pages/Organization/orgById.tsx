
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Building, Users, FileText, CreditCard, UserCheck } from 'lucide-react';

import { OrganizationData, Tab, TabKey, LocationState } from '../../components/orgById/types';

import { mockOrgDataMap } from '../../components/orgById/data';


import {
    TabButton,
    OrganizationHeader,
    OverviewTab,
    MembersTab,
    AccessTab,
    AgentsTab,
    BillingTab
} from '../../components/orgById/orgTabs';
import SearchBar from '../../components/ui/SearchBar';
import Blank from '../../components/ui/Blank';


const OrgById: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as LocationState;

    const [orgId, setOrgId] = useState<string>(state?.orgId || '');
    const [loading, setLoading] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<TabKey>('overview');
    const [data, setData] = useState<OrganizationData | null>(null);
    const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

    const tabs: Tab[] = [
        { id: 'overview', label: 'Overview', icon: <Building className="h-4 w-4" /> },
        { id: 'members', label: 'Members', icon: <Users className="h-4 w-4" /> },
        { id: 'access', label: 'Access', icon: <UserCheck className="h-4 w-4" /> },
        { id: 'agents', label: 'Agents', icon: <CreditCard className="h-4 w-4" /> },
        // { id: 'documents', label: 'Documents', icon: <FileText className="h-4 w-4" /> },
        { id: 'billing', label: 'Billing', icon: <CreditCard className="h-4 w-4" /> }
    ];

    const handleSearch = async (e?: React.MouseEvent | React.KeyboardEvent): Promise<void> => {
        if (e) e.preventDefault();
        const str = orgId ?? "";
        const trimmedTerm = str.trim();
        if (!trimmedTerm) return;

        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // In real implementation, make API call here
            // const response = await fetch(`/api/organizations/${trimmedTerm}`);
            // const orgData = await response.json();

            const orgData = mockOrgDataMap[trimmedTerm];
            if (orgData) {
                setData(orgData);
            } else {
                setData(null);
                console.error('Organization not found');
            }
        } catch (error) {
            console.error('Error fetching organization:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (section: string): void => {
        console.log(`Edit ${section}`);
        // Navigate to edit page or open modal
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string): string => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const renderTabContent = (): React.ReactNode => {
        if (!data) return null;

        const commonProps = {
            data,
            onEdit: handleEdit,
            formatDate,
            getStatusColor,
            showPassword,
            setShowPassword
        };

        switch (activeTab) {
            case 'overview':
                return <OverviewTab {...commonProps} />;
            case 'members':
                return <MembersTab {...commonProps} />;
            case 'access':
                return <AccessTab {...commonProps} />;
            case 'agents':
                return <AgentsTab {...commonProps} />;
            // case 'documents':
            //     return <div className="text-center py-8 text-gray-500">Documents section coming soon...</div>;
            case 'billing':
                return <BillingTab {...commonProps} />;;
            default:
                return <div>Select a tab to view content</div>;
        }
    };

    useEffect(() => {
        // If orgId is provided from navigation state, search immediately
        if (orgId) {
            handleSearch();
        }
    }, []);

    return (
        <Blank title="Organization By ID">
            {/* Header Section with Search */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-lg shadow-sm border">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Organization Details</h1>
                        <p className="text-gray-600">Manage org information and settings</p>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-4 sm:mt-0 sm:ml-4">
                        <SearchBar
                            value={orgId}
                            onChange={setOrgId}
                            onSearch={handleSearch}
                            placeholder="Search organization..."
                            searchbtn={true}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>

            {/* Organization Header with Logo and Name */}
            {data && <OrganizationHeader data={data} />}

            {data && (
                <>
                    {/* Tab Navigation */}
                    <div className="bg-white rounded-lg shadow-sm border">
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 px-6 mt-5 mb-5" aria-label="Tabs">
                                {tabs.map((tab: Tab) => (
                                    <TabButton
                                        key={tab.id}
                                        tab={tab}
                                        isActive={activeTab === tab.id}
                                        onClick={() => setActiveTab(tab.id as TabKey)}
                                    />
                                ))}
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {renderTabContent()}
                        </div>
                    </div>
                </>
            )}

            {!data && !loading && (
                <div className="text-center py-12">
                    <div className="text-gray-500">
                        <Search className="h-12 w-12 mx-auto mb-4" />
                        <p>Search for an organization to view details</p>
                        <p className="text-sm mt-2">Try searching for: "1234567890" (Casagrand) or "1234567891" (TVK)</p>
                    </div>
                </div>
            )}
        </Blank>
    );
}

export default OrgById;