const layout = [
    {
        path: '/user/create-user',
        component: resolve => require(['components/user/manage-user'], resolve),
        meta: {
            title: "Create User",
            permissions: [
                {
                    entity: "User",
                    permission_key: "SAVE"
                },
                {
                    entity: "Media",
                    permission_key: "SAVE"
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: "LIST"
                },
                {
                    entity: 'Group',
                    permission_key: "LIST"
                },
                {
                    entity: 'Role',
                    permission_key: "LIST"
                }
            ],
        }
    },
    {
        path: '/user/update-user/:user_id',
        component: resolve => require(['components/user/manage-user'], resolve),
        meta: {
            title: "Edit User",
            permissions: [
                {
                    entity: "User",
                    permission_key: "UPDATE"
                },
                {
                    entity: "User",
                    permission_key: "SHOW"
                },
                {
                    entity: "Media",
                    permission_key: "SAVE"
                },
                {
                    entity: "Group",
                    permission_key: "LIST"
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: "LIST"
                },
                {
                    entity: 'Group',
                    permission_key: "LIST"
                },
                {
                    entity: 'Role',
                    permission_key: "LIST"
                }
            ],
        }
    },
    {
        path: '/user_profile',
        component: resolve => require(['components/user/manage-user'], resolve),
        meta: {
            title: "Edit Profile",
            permissions: [
                {
                    entity: "User",
                    permission_key: "UPDATE MINE"
                },
                {
                    entity: "User",
                    permission_key: "SHOW"
                },
                {
                    entity: "Media",
                    permission_key: "SAVE"
                },
                {
                    entity: "Group",
                    permission_key: "LIST"
                },
                {
                    entity: 'Role',
                    permission_key: "LIST"
                }
            ]
        }
    },
    {
        path: '/user/list',
        component: resolve => require(['components/user/list'], resolve),
        meta: {
            title: "Users",
            permissions: [
                {
                    entity: 'User',
                    permission_key: 'LIST'
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                }
            ]
        }
    },
    {
        path: '/role/create-role',
        component: resolve => require(['components/role/manage-role'], resolve),
        meta: {
            title: "Create Role",
            permissions: [
                {
                    entity: 'Role',
                    permission_key: 'LIST'
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                },
                {
                    entity: 'Role',
                    permission_key: 'SAVE'
                }
            ]
        }
    },
    {
        path: '/role/update-role/:role_id',
        component: resolve => require(['components/role/manage-role'], resolve),
        meta: {
            title: "Edit Role",
            permissions: [
                {
                    entity: 'Role',
                    permission_key: 'LIST'
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                },
                {
                    entity: 'Role',
                    permission_key: 'UPDATE'
                },
                {
                    entity: "Role",
                    permission_key: "UPDATE MINE",
                    override: true
                },
            ]
        }
    },
    {
        path: '/role/list',
        component: resolve => require(['components/role/list'], resolve),
        meta: {
            title: "Roles",
            permissions: [
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                },
                {
                    entity: 'Role',
                    permission_key: 'LIST'
                }
            ]
        }
    },
    {
        path: '/dashboard',
        component: resolve => require(['components/dashboard/admin/admin-dashboard'], resolve),
        meta: {
            title: "Dashboard",
            permissions: [
                {
                    entity: 'HashTag',
                    permission_key: 'TRENDING'
                },
                {
                    entity: 'FAQ',
                    permission_key: 'VISIBILITY_PERCENTAGE'
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'FAQS_CREATED_CHART'
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'FAQS_VIEWED_CHART'
                }
            ]
        }
    },
    {
        path: '/search-result',
        component: resolve => require(['components/search-results/result'], resolve),
        meta: {
            title: "Search Results",
            // permissions: [
            //     {
            //         entity: 'ServiceCategory',
            //         permission_key: 'RECENT'
            //     },
            //     {
            //         entity: 'FAQ',
            //         permission_key: 'TRENDING'
            //     },
            //     {
            //         entity: 'FAQ',
            //         permission_key: 'TOP_VIEWED'
            //     }
            // ]
        }
    },
    {
        path: '/home',
        component: resolve => require(['components/dashboard/frontLiner/front-liner-dashboard'], resolve),
        meta: {
            title: "Dashboard",
            permissions: [
                {
                    entity: 'ServiceCategory',
                    permission_key: 'RECENT'
                },
                {
                    entity: 'FAQ',
                    permission_key: 'TRENDING'
                },
                {
                    entity: 'FAQ',
                    permission_key: 'TOP_VIEWED'
                }
            ]
        }
    },
    {
        path: '/my-list/linked-faqs/:list_id',
        component: resolve => require(['components/myList/linked-faqs'], resolve),
        meta: {
            title: "My List FAQs",
            permissions: [
                {
                    entity: 'FAQ',
                    permission_key: 'SHOW'
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                }
            ],
        }
    },
    {
        path: '/my-list/list',
        component: resolve => require(['components/myList/list'], resolve),
        meta: {
            title: "My List",
            permissions: [
                {
                    entity: "FAQ",
                    permission_key: "ADD_TO_MY_LIST"
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                }
            ],
        }
    },
    {
        path: '/my-list/create-mylist',
        component: resolve => require(['components/myList/add-to-my-list'], resolve),
        meta: {
            title: "Add to My List",
            permissions: [
                {
                    entity: "FAQ",
                    permission_key: "ADD_TO_MY_LIST"
                }
            ],
        }
    },
    {
        path: '/my-list/create-mylist/:faq_id',
        component: resolve => require(['components/myList/add-to-my-list'], resolve),
        meta: {
            title: "Add to My Lists",
            permissions: [
                {
                    entity: "FAQ",
                    permission_key: "ADD_TO_MY_LIST"
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                }
            ],
        }
    },
    {
        path: '/my-list/update-mylist/:id',
        component: resolve => require(['components/myList/add-to-my-list'], resolve),
        meta: {
            title: "Update My List",
            permissions: [
                {
                    entity: "FAQ",
                    permission_key: "ADD_TO_MY_LIST"
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                }
            ],
        }
    },
    {
        path: '/faq/list',
        component: resolve => require(['components/faq/list'], resolve),
        meta: {
            title: "FAQs",
            permissions: [
                {
                    entity: "FAQ",
                    permission_key: "LIST"
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                }
            ],
        }
    },
    {
        path: '/faq/create-faq',
        component: resolve => require(['components/faq/create-faq'], resolve),
        meta: {
            title: "Create New FAQ",
            permissions: [
                {
                    entity: "FAQ",
                    permission_key: "SAVE"
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                },
                {
                    entity: 'Nationality',
                    permission_key: 'LIST'
                },
                {
                    entity: 'Country',
                    permission_key: 'LIST'
                },
                {
                    entity: 'Directory',
                    permission_key: 'LIST'
                },
                {
                    entity: 'HashTag',
                    permission_key: 'LIST'
                },
                {
                    entity: 'Media',
                    permission_key: 'LIST'
                },
                {
                    entity: 'Nationality',
                    permission_key: 'LIST'
                }
            ],
        }
    },
    {
        path: '/faq/update-faq/:fid',
        component: resolve => require(['components/faq/create-faq'], resolve),
        meta: {
            title: "Update New FAQ item",
            permissions: [
                {
                    entity: "FAQ",
                    permission_key: "UPDATE"
                },
                {
                    entity: "FAQ",
                    permission_key: "SHOW"
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                },
                {
                    entity: 'Directory',
                    permission_key: 'LIST'
                },
                {
                    entity: 'HashTag',
                    permission_key: 'LIST'
                },
                {
                    entity: 'Media',
                    permission_key: 'LIST'
                },
                {
                    entity: 'Nationality',
                    permission_key: 'LIST'
                },
                {
                    entity: 'Country',
                    permission_key: 'LIST'
                },
                {
                    entity: "FAQ",
                    permission_key: "UPDATE MINE",
                    override: true
                },
            ],
        }
    },
    {
        path: '/faq/approve-faq/:id',
        component: resolve => require(['components/faq/approve-faq'], resolve),
        meta: {
            title: "Approve FAQ",
            permissions: [
                {
                    entity: "FAQ",
                    permission_key: "PUBLISH"
                },
                {
                    entity: "FAQ",
                    permission_key: "DECLINE"
                },
                {
                    entity: "FAQ",
                    permission_key: "SHOW"
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                }
            ],
        }
    },
    {
        path: '/faq/view/:id',
        component: resolve => require(['components/faq/view-faq'], resolve),
        meta: {
            title: "View FAQ",
            permissions: [
                {
                    entity: "FAQ",
                    permission_key: "SHOW"
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                }
            ],
        }
    },
    {
        path: '/media/list',
        component: resolve => require(['components/mediaContent/list'], resolve),
        meta: {
            title: "Media Content",
            permissions: [
                {
                    entity: "Media",
                    permission_key: "LIST"
                }
            ],
        }
    },
    {
        path: '/media/update-media-content/:id',
        component: resolve => require(['components/mediaContent/create-media-content'], resolve),
        meta: {
            title: "Media",
            permissions: [
                {
                    entity: "Media",
                    permission_key: "UPDATE"
                },
                {
                    entity: "Media",
                    permission_key: "SHOW"
                },
                {
                    entity: "Media",
                    permission_key: "UPDATE MINE",
                    override: true
                },
            ],
        }
    },
    {
        path: '/media/create-media-content',
        component: resolve => require(['components/mediaContent/create-media-content'], resolve),
        meta: {
            title: "Create Media",
            permissions: [
                {
                    entity: "Media",
                    permission_key: "SAVE"
                }
            ],
        }
    },
    {
        path: '/directory/list',
        component: resolve => require(['components/directory/list'], resolve),
        meta: {
            title: "List Directories",
            permissions: [
                {
                    entity: "Directory",
                    permission_key: "LIST"
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                }
            ],
        }
    },
    {
        path: '/directory/update-directory/:id',
        component: resolve => require(['components/directory/create-directory/create-directory'], resolve),
        meta: {
            title: "Update Directory",
            permissions: [
                {
                    entity: "Directory",
                    permission_key: "SHOW"
                },
                {
                    entity: "Directory",
                    permission_key: "UPDATE"
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                },
                {
                    entity: "Directory",
                    permission_key: "UPDATE MINE",
                    override: true
                },
            ],
        }
    },
    {
        path: '/directory/view/:id',
        component: resolve => require(['components/directory/view-directory'], resolve),
        meta: {
            title: "View Directory",
            permissions: [
                {
                    entity: "Directory",
                    permission_key: "SHOW"
                }
            ],
        }
    },
    {
        path: '/directory/create-directory',
        component: resolve => require(['components/directory/create-directory/create-directory'], resolve),
        meta: {
            title: "Create Directory",
            permissions: [
                {
                    entity: "Directory",
                    permission_key: "SAVE"
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                }
            ],
        }
    },
    {
        path: '/categories/update-category/:id',
        component: resolve => require(['components/categories/create-category'], resolve),
        meta: {
            title: "Update Service Category",
            permissions: [
                {
                    entity: "ServiceCategory",
                    permission_key: "UPDATE"
                },
                {
                    entity: "ServiceCategory",
                    permission_key: "SHOW"
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                },
                {
                    entity: "ServiceCategory",
                    permission_key: "UPDATE MINE",
                    override: true
                },
            ],
        }
    },
    {
        path: '/categories/create-category',
        component: resolve => require(['components/categories/create-category'], resolve),
        meta: {
            title: "Create Service Category",
            permissions: [
                {
                    entity: "ServiceCategory",
                    permission_key: "SAVE"
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                }
            ],
        }
    },
    {
        path: '/categories/list',
        component: resolve => require(['components/categories/list'], resolve),
        meta: {
            title: "Service Categories",
            permissions: [
                {
                    entity: "ServiceCategory",
                    permission_key: "LIST"
                }
            ],
        }
    },
    {
        path: '/nationality/create-nationality',
        component: resolve => require(['components/nationality/create-nationality'], resolve),
        meta: {
            title: "Create Nationality",
            permissions: [
                {
                    entity: "Nationality",
                    permission_key: "SAVE"
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                }
            ],
        }
    },
    {
        path: '/nationality/update-nationality/:id',
        component: resolve => require(['components/nationality/create-nationality'], resolve),
        meta: {
            title: "Update Nationality",
            permissions: [
                {
                    entity: "Nationality",
                    permission_key: "SHOW"
                },
                {
                    entity: "Nationality",
                    permission_key: "UPDATE"
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                },
                {
                    entity: "Nationality",
                    permission_key: "UPDATE MINE",
                    override: true
                },
            ],
        }
    },
    {
        path: '/nationality/list',
        component: resolve => require(['components/nationality/list'], resolve),
        meta: {
            title: "Nationalities",
            permissions: [
                {
                    entity: "Nationality",
                    permission_key: "LIST"
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                }
            ],
        }
    },
    {
        path: '/country/create-country',
        component: resolve => require(['components/country/create-country'], resolve),
        meta: {
            title: "Create Country",
            permissions: [
                {
                    entity: "Country",
                    permission_key: "SAVE"
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                }
            ],
        }
    },
    {
        path: '/country/update-country/:id',
        component: resolve => require(['components/country/create-country'], resolve),
        meta: {
            title: "Update Country",
            permissions: [
                {
                    entity: "Country",
                    permission_key: "SHOW"
                },
                {
                    entity: "Country",
                    permission_key: "UPDATE"
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                },
                {
                    entity: "Country",
                    permission_key: "UPDATE MINE",
                    override: true
                },
            ],
        }
    },
    {
        path: '/country/list',
        component: resolve => require(['components/country/list'], resolve),
        meta: {
            title: "Countries",
            permissions: [
                {
                    entity: "Country",
                    permission_key: "LIST"
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                }
            ],
        }
    },
    {
        path: '/directory',
        component: resolve => require(['components/directories/list'], resolve),
        meta: {
            title: "Directory Search",
            permissions: [
                {
                    entity: "Directory",
                    permission_key: "SHOW"
                }
            ],
        }
    },
    {
        path: '/media-items',
        component: resolve => require(['components/media-items/list'], resolve),
        meta: {
            title: "Multimedia Search",
            permissions: [
                {
                    entity: "Media",
                    permission_key: "LIST"
                },
            ],
        }
    },
    {
        path: '/media-items/:media_id',
        component: resolve => require(['components/media-items/list'], resolve),
        meta: {
            title: "Media",
            permissions: [
                {
                    entity: "Media",
                    permission_key: "LIST"
                },
            ],
        }
    },
    {
        path: '/directory-type/create-directory-type',
        component: resolve => require(['components/directoryType/create-directory-type'], resolve),
        meta: {
            title: "Create Directory Type",
            permissions: [
                {
                    entity: "Directory",
                    permission_key: "SAVE"
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                }
            ],
        }
    },
    {
        path: '/directory-type/update-directory-type/:id',
        component: resolve => require(['components/directoryType/create-directory-type'], resolve),
        meta: {
            title: "Update Directory Type",
            permissions: [
                {
                    entity: "Directory",
                    permission_key: "SHOW"
                },
                {
                    entity: "Directory",
                    permission_key: "UPDATE"
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                },
                {
                    entity: "Directory",
                    permission_key: "UPDATE MINE",
                    override: true
                },
            ],
        }
    },
    {
        path: '/directory-type/list',
        component: resolve => require(['components/directoryType/list'], resolve),
        meta: {
            title: "Directory Types",
            permissions: [
                {
                    entity: "Directory",
                    permission_key: "LIST"
                },
                // {
                //     entity: 'ServiceCategory',
                //     permission_key: 'LIST'
                // }
            ],
        }
    },
    {
        path: '/hashtag/update-hashtag/:id',
        component: resolve => require(['components/hashtag/create-hashtag'], resolve),
        meta: {
            title: "Update Hastag",
            permissions: [
                {
                    entity: "HashTag",
                    permission_key: "SHOW"
                },
                {
                    entity: "HashTag",
                    permission_key: "UPDATE"
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                },
                {
                    entity: "HashTag",
                    permission_key: "UPDATE MINE",
                    override: true
                },
            ],
        }
    },
    {
        path: '/hashtag/create-hashtag',
        component: resolve => require(['components/hashtag/create-hashtag'], resolve),
        meta: {
            title: "Create Hashtag",
            permissions: [
                {
                    entity: "HashTag",
                    permission_key: "SAVE"
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                }
            ],
        }
    },
    {
        path: '/hashtag/list',
        component: resolve => require(['components/hashtag/list'], resolve),
        meta: {
            title: "Hashtags",
            permissions: [
                {
                    entity: "HashTag",
                    permission_key: "LIST"
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                }
            ],
        }
    },
    {
        path: '/unit/create-unit',
        component: resolve => require(['components/unit/create-unit'], resolve),
        meta: {
            title: "Create Unit",
            permissions: [
                {
                    entity: "Group",
                    permission_key: "SAVE"
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                }
            ],
        }
    },
    {
        path: '/unit/update-unit/:id',
        component: resolve => require(['components/unit/create-unit'], resolve),
        meta: {
            title: "Update Unit",
            permissions: [
                {
                    entity: "Group",
                    permission_key: "SHOW"
                },
                {
                    entity: "Group",
                    permission_key: "UPDATE"
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                },
                {
                    entity: "Group",
                    permission_key: "UPDATE MINE",
                    override: true
                },
            ],
        }
    },
    {
        path: '/unit/list',
        component: resolve => require(['components/unit/list'], resolve),
        meta: {
            title: "Units",
            permissions: [
                {
                    entity: "Group",
                    permission_key: "LIST"
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                }
            ],
        }
    },
    {
        path: '/frontline/category/:id/faqs',
        component: resolve => require(['components/frontLine/subCategoryFaqs/faqsPerCategory'], resolve),
        meta: {
            title: "FAQs",
            permissions: [
                {
                    entity: "FAQ",
                    permission_key: "FRONTLINER_VIEW"
                },
                {
                    entity: "Directory",
                    permission_key: "LIST"
                },
                {
                    entity: "ServiceCategory",
                    permission_key: "LIST"
                },
                {
                    entity: "Media",
                    permission_key: "LIST"
                }
            ],
        }
    },
    {
        path: '/403',
        component: resolve => require(['pages/403'], resolve),
        meta: {
            title: "403",
        }
    },
    {
        path: '/me',
        component: resolve => require(['components/dashboard/other'], resolve),
        meta: {
            title: "Welcome"
        }
    },
    {
        path: '/frontline/category/:id/faqs',
        component: resolve => require(['components/frontLine/subCategoryFaqs/faqsPerCategory'], resolve),
        meta: {
            title: "Category",
            permissions : [
                {
                    entity: "FAQ",
                    permission_key: "FRONTLINER_VIEW"
                }
            ]
        }
    },
    {
        path: '/frontline/category/:id/recent-faqs',
        component: resolve => require(['components/frontLine/subCategoryFaqs/faqsPerCategory'], resolve),
        meta: {
            title: "Category",
            permissions : [
                {
                    entity: "FAQ",
                    permission_key: "FRONTLINER_VIEW"
                }
            ]
        }
    },
    {
        path: '/frontline/faq/:faq_id',
        component: resolve => require(['components/frontLine/subCategoryFaqs/faqsPerCategory'], resolve),
        meta: {
            title: "FAQs",
            permissions : [
                {
                    entity: "FAQ",
                    permission_key: "FRONTLINER_VIEW"
                }
            ]
        }
    },
    {
        path: '/frontline/directory/:directory_id',
        component: resolve => require(['components/search-results/result'], resolve),
        meta: {
            title: "Directory",
            permissions : [
                {
                    entity: "DIRECTORY",
                    permission_key: "FRONTLINER_VIEW"
                }
            ]
        }
    },
    {
        path: '/frontline/media/:media_id',
        component: resolve => require(['components/search-results/result'], resolve),
        meta: {
            title: "Media",
            permissions : [
                {
                    entity: "Media",
                    permission_key: "FRONTLINER_VIEW"
                }
            ]
        }
    },
    {
        path: '/frontline/faq-hashtag/:hashtag',
        component: resolve => require(['components/frontLine/subCategoryFaqs/faqsPerCategory'], resolve),
        meta: {
            title: "FAQs",
            permissions : [
                {
                    entity: "FAQ",
                    permission_key: "FRONTLINER_VIEW"
                }
            ]
        }
    },
    {
        path:'/languages/list',
        component: resolve => require(['components/languages/list'], resolve),
        meta: {
            title: 'Languages',
            permissions: [
                {
                    entity:"Language",
                    permission_key:"LIST"
                }
            ]
        }
    },
    {
        path: '/languages/create-language',
        component: resolve => require(['components/languages/manage-language'], resolve),
        meta: {
            title: "Create Language",
            permissions: [
                {
                    entity: 'Language',
                    permission_key: 'LIST'
                },
                {
                    entity: 'Language',
                    permission_key: 'SAVE'
                }
            ]
        }
    },
    {
        path:'/languages/update-language/:id',
        component: resolve => require(['components/languages/manage-language'], resolve),
        meta: {
            title: 'Languages',
            permissions: [
                {
                    entity: "Language",
                    permission_key: "SHOW"
                },
                {
                    entity: "Language",
                    permission_key: "UPDATE"
                },
                {
                    entity: 'Language',
                    permission_key: 'LIST'
                },
                {
                    entity: "Language",
                    permission_key: "UPDATE MINE",
                    override: true
                },
            ]
        }
    },
    {
        path: '/directory-media/list',
        component: resolve => require(['components/directoryMedia/list'], resolve),
        meta: {
            title: 'Directory Media',
            permissions: [
                {
                    entity: "DirectoryMedia",
                    permission_key: "LIST"
                }
            ]
        }
    },
    {
        path: '/directory-media/create',
        component: resolve => require(['components/directoryMedia/manage-directory-media'], resolve),
        meta: {
            title: 'Create Directory Media',
            permissions: [
                {
                    entity: "DirectoryMedia",
                    permission_key: "LIST"
                },
                {
                    entity: "DirectoryMedia",
                    permission_key: "SHOW"
                },
                {
                    entity: "DirectoryMedia",
                    permission_key: "SAVE"
                },
                {
                    entity: "DirectoryMedia",
                    permission_key: "UPDATE MINE"
                }
            ]
        }
    },
    {
        path: '/directory-media/update/:id',
        component: resolve => require(['components/directoryMedia/manage-directory-media'], resolve),
        meta: {
            title: 'Update Directory Media',
            permissions: [
                {
                    entity: "DirectoryMedia",
                    permission_key: "LIST"
                },
                {
                    entity: "DirectoryMedia",
                    permission_key: "SHOW"
                },
                {
                    entity: "DirectoryMedia",
                    permission_key: "UPDATE"
                },
                {
                    entity: "DirectoryMedia",
                    permission_key: "UPDATE MINE"
                }
            ]
        }
    },
    {
        path: '/directory-country/create',
        component: resolve => require(['components/directoryCountry/manage-directory-country'], resolve),
        meta: {
            title: "Create Directory Country",
            permissions: [
                {
                    entity: "DirectoryCountry",
                    permission_key: "SAVE"
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                }
            ],
        }
    },
    {
        path: '/directory-country/update/:id',
        component: resolve => require(['components/directoryCountry/manage-directory-country'], resolve),
        meta: {
            title: "Update Directory Country",
            permissions: [
                {
                    entity: "DirectoryCountry",
                    permission_key: "SHOW"
                },
                {
                    entity: "DirectoryCountry",
                    permission_key: "UPDATE"
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                },
                {
                    entity: "DirectoryCountry",
                    permission_key: "UPDATE MINE",
                    override: true
                },
            ],
        }
    },
    {
        path: '/directory-country/list',
        component: resolve => require(['components/directoryCountry/list'], resolve),
        meta: {
            title: "Directory Countries",
            permissions: [
                {
                    entity: "DirectoryCountry",
                    permission_key: "LIST"
                },
                {
                    entity: 'ServiceCategory',
                    permission_key: 'LIST'
                }
            ],
        }
    },

    {
        path: '/search-anlytics/list',
        component: resolve => require(['components/searchAnalytics/list'], resolve),
        meta: {
            title: "Search Analytics List",
            permissions: [
                {
                    entity: 'CaptureSearch',
                    permission_key: 'LIST'
                }
            ],
        }
    },
    {
        path: '/search-analytics/view/:id',
        component: resolve => require(['components/searchAnalytics/view'], resolve),
        meta: {
            title: "View Search Request",
            permissions: [
                {
                    entity: 'CaptureSearch',
                    permission_key: 'LIST'
                },
                {
                    entity: 'CaptureSearch',
                    permission_key: 'SHOW'
                }
            ],
        }
    }
];

export default layout;
