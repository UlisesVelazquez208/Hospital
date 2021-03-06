const icons = [
    'icon-activity_needs_assessment',
    'icon-activity_policy',
    'icon-activity_financing',
    'icon-activity_information_management',
    'icon-activity_information_technology',
    'icon-activity_analysis',
    'icon-activity_fund',
    'icon-activity_training',
    'icon-activity_leadership',
    'icon-activity_partnership',
    'icon-activity_deployment',
    'icon-activity_humanitarian_programme_cycle',
    'icon-activity_services_and_tools',
    'icon-activity_scale_operation',
    'icon-activity_staff_management',
    'icon-activity_innovation',
    'icon-activity_response',
    'icon-activity_meeting',
    'icon-activity_assessment',
    'icon-activity_public_information',
    'icon-activity_civil-military_coordination',
    'icon-activity_gap_analysis',
    'icon-activity_preparedness',
    'icon-activity_learning',
    'icon-activity_advocacy',
    'icon-activity_coordinated_assessment',
    'icon-activity_reporting',
    'icon-camp_IDP_refugee_camp',
    'icon-camp_temporary_camp',
    'icon-camp_permanent_camp',
    'icon-camp_transition_site',
    'icon-camp_spontaneous_site',
    'icon-camp_registration',
    'icon-cluster_CCCM',
    'icon-cluster_early_recovery',
    'icon-cluster_education',
    'icon-cluster_emergency_telecommunications',
    'icon-cluster_health',
    'icon-cluster_food_security',
    'icon-cluster_protection',
    'icon-cluster_WASH',
    'icon-cluster_shelter',
    'icon-cluster_logistics',
    'icon-cluster_nutrition',
    'icon-crisis_humanitarian_access',
    'icon-crisis_population_displacement',
    'icon-crisis_population_return',
    'icon-crisis_conflict',
    'icon-damage_affected',
    'icon-damage_destroyed',
    'icon-damage_not_affected',
    'icon-damage_airport_affected',
    'icon-damage_airport_destroyed',
    'icon-damage_airport_not_affected',
    'icon-damage_bridge_affected',
    'icon-damage_bridge_destroyed',
    'icon-damage_bridge_not_affected',
    'icon-damage_building_not_affected',
    'icon-damage_port_affected',
    'icon-damage_port_destroyed',
    'icon-damage_port_not_affected',
    'icon-damage_building_affected',
    'icon-damage_building_destroyed',
    'icon-damage_house_affected',
    'icon-damage_house_destroyed',
    'icon-damage_house_not_affected',
    'icon-damage_road_affected',
    'icon-damage_road_destroyed',
    'icon-damage_road_not_affected',
    'icon-damage_school_affected',
    'icon-damage_school_destroyed',
    'icon-damage_school_not_affected',
    'icon-disaster_cold_wave',
    'icon-disaster_heatwave',
    'icon-disaster_cyclone',
    'icon-disaster_earthquake',
    'icon-disaster_fire',
    'icon-disaster_epidemic',
    'icon-disaster_insect_infestation',
    'icon-disaster_heavy_rain',
    'icon-disaster_drought',
    'icon-disaster_flash_flood',
    'icon-disaster_flood',
    'icon-disaster_snow_avalanche',
    'icon-disaster_storm_surge',
    'icon-disaster_tsunami',
    'icon-disaster_landslide',
    'icon-disaster_technological',
    'icon-disaster_tornado',
    'icon-disaster_violent_wind',
    'icon-disaster_locust_infestation',
    'icon-disaster_snowfall',
    'icon-disaster_storm',
    'icon-disaster_volcano',
    'icon-food_NFI_mosquito_net',
    'icon-food_NFI_blanket',
    'icon-food_NFI_bottled_water',
    'icon-food_NFI_bucket',
    'icon-food_NFI_clothing',
    'icon-food_NFI_detergent',
    'icon-food_NFI_flour',
    'icon-food_NFI_food',
    'icon-food_NFI_infant_formula',
    'icon-food_NFI_kitchen_set',
    'icon-food_NFI_mattress',
    'icon-food_NFI_medicine',
    'icon-food_NFI_medical_supply',
    'icon-food_NFI_non-food_items',
    'icon-food_NFI_oil',
    'icon-food_NFI_plastic_sheeting',
    'icon-food_NFI_relief_goods',
    'icon-food_NFI_rice',
    'icon-food_NFI_salt',
    'icon-food_NFI_sugar',
    'icon-food_NFI_stove',
    'icon-food_NFI_soap',
    'icon-food_NFI_tarpaulin',
    'icon-food_NFI_vaccine',
    'icon-food_NFI_tent',
    'icon-infrastructure_infrastructure',
    'icon-infrastructure_government_office',
    'icon-infrastructure_diplomatic_mission',
    'icon-infrastructure_assembly_point',
    'icon-infrastructure_hotel',
    'icon-infrastructure_house',
    'icon-infrastructure_police_station',
    'icon-infrastructure_church',
    'icon-infrastructure_mosque',
    'icon-infrastructure_hindu_temple',
    'icon-infrastructure_buddhist_temple',
    'icon-infrastructure_health_facility',
    'icon-infrastructure_hospital',
    'icon-infrastructure_mobile_clinic',
    'icon-infrastructure_health_post',
    'icon-infrastructure_school',
    'icon-infrastructure_clinic',
    'icon-infrastructure_food_warehouse',
    'icon-infrastructure_building',
    'icon-infrastructure_community_building',
    'icon-infrastructure_distribution_site',
    'icon-infrastructure_university',
    'icon-infrastructure_UN_office',
    'icon-infrastructure_NGO_office',
    'icon-logistics_airport',
    'icon-logistics_airport_military',
    'icon-logistics_boat',
    'icon-logistics_truck',
    'icon-logistics_bridge',
    'icon-logistics_car',
    'icon-logistics_gas_station',
    'icon-logistics_helicopter',
    'icon-logistics_helipad',
    'icon-logistics_road',
    'icon-logistics_port',
    'icon-logistics_train',
    'icon-logistics_tunnel',
    'icon-logistics_ferry',
    'icon-logistics_ship',
    'icon-logistics_bus',
    'icon-other_cluster_coordination',
    'icon-other_cluster_rule_of_law',
    'icon-other_cluster_environment',
    'icon-other_cluster_multicluster',
    'icon-other_cluster_agriculture',
    'icon-other_cluster_fishery',
    'icon-other_cluster_safety_security',
    'icon-other_cluster_other',
    'icon-people_affected_population',
    'icon-people_missing',
    'icon-people_dead',
    'icon-people_injured',
    'icon-people_woman',
    'icon-people_children',
    'icon-people_elderly',
    'icon-people_pregnant',
    'icon-people_physical_impairments',
    'icon-people_man',
    'icon-people_child_combatant',
    'icon-people_infant',
    'icon-people_national_army',
    'icon-people_peacekeeping_force',
    'icon-people_rebel',
    'icon-people_drowned',
    'icon-physical_barrier_physical_closure',
    'icon-physical_barrier_checkpoint',
    'icon-physical_barrier_mililtary_gate',
    'icon-physical_barrier_observation_tower',
    'icon-physical_barrier_roadblock',
    'icon-physical_barrier_border_crossing',
    'icon-physical_barrier_earthmound',
    'icon-physical_barrier_road_barrier',
    'icon-product_type_calendar',
    'icon-product_type_chart',
    'icon-product_type_data',
    'icon-product_type_document',
    'icon-product_type_film',
    'icon-product_type_map',
    'icon-product_type_photo',
    'icon-product_type_report',
    'icon-product_type_table',
    'icon-security_arrest',
    'icon-security_assault',
    'icon-security_carjacking',
    'icon-security_dangerous_area',
    'icon-security_forced_entry',
    'icon-security_mine',
    'icon-security_attack',
    'icon-security_harrassment',
    'icon-security_murder',
    'icon-security_house_burned',
    'icon-security_forced_recruitment',
    'icon-security_abduction',
    'icon-security_robbery',
    'icon-socioeconomic_population_growth',
    'icon-socioeconomic_livestock',
    'icon-socioeconomic_livelihood',
    'icon-socioeconomic_debris_management',
    'icon-socioeconomic_trade_and_market',
    'icon-socioeconomic_reconstruction',
    'icon-socioeconomic_urban',
    'icon-socioeconomic_urban_rural',
    'icon-socioeconomic_rural_exodus',
    'icon-socioeconomic_rural',
    'icon-telecommunications_computer',
    'icon-telecommunications_radio',
    'icon-telecommunications_walkie_talkie',
    'icon-telecommunications_e-mail',
    'icon-telecommunications_fax',
    'icon-telecommunications_internet',
    'icon-telecommunications_mobile_phone',
    'icon-wash_latrine_cabin',
    'icon-wash_toilet',
    'icon-wash_shower',
    'icon-wash_sanitation',
    'icon-wash_solid_waste',
    'icon-wash_spring_water',
    'icon-wash_submersible_pump',
    'icon-wash_water_trucking',
    'icon-wash_communal_latrine',
    'icon-wash_water_source',
    'icon-wash_potable_water_source',
    'icon-wash_borehole',
    'icon-wash_well',
    'icon-wash_potable_water',
    'icon-airport_closed',
    'icon-bridge_closed',
    'icon-building_closed',
    'icon-case_management',
    'icon-covid_19',
    'icon-doctor',
    'icon-handwashing',
    'icon-health_worker',
    'icon-hospital_bed',
    'icon-house_lockdown',
    'icon-infected',
    'icon-infection_control',
    'icon-laboratory',
    'icon-life_saving',
    'icon-location_lockdown',
    'icon-market',
    'icon-market_closed',
    'icon-mask',
    'icon-not_infected',
    'icon-physical_distancing',
    'icon-port_closed',
    'icon-remote_support',
    'icon-respiratory',
    'icon-road_closed',
    'icon-sanitizer',
    'icon-school_closed',
    'icon-ventilator',
    'icon-testing',
    'icon-work_from_home',
];
export { icons as default };