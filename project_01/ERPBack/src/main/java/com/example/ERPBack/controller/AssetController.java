package com.example.ERPBack.controller;

import com.example.ERPBack.entity.Asset_table;
import com.example.ERPBack.entity.Department_table;
import com.example.ERPBack.entity.Status; // Status 열거형 import 추가
import com.example.ERPBack.repository.AssetRepository;
import com.example.ERPBack.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class AssetController {

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    // GET 요청: 모든 자산 데이터를 조회
    @GetMapping("/assets")
    public List<Asset_table> getAllAssets() {
        return assetRepository.findAll();
    }

    // POST 요청: 새로운 자산 데이터를 저장
    @PostMapping("/assets")
    public Asset_table createAsset(@RequestBody Asset_table asset) {
        if (asset.getCreate_year() == null && asset.getCreate_year() != null) {
            try {
                String createYearStr = asset.getCreate_year().toString();
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                LocalDate createYear = LocalDate.parse(createYearStr, formatter);
                asset.setCreate_year(createYear);
            } catch (Exception e) {
                throw new IllegalArgumentException("Invalid create_year format. Expected format: YYYY-MM-DD", e);
            }
        }
        return assetRepository.save(asset);
    }

    // GET 요청: 모든 부서명 조회
    @GetMapping("/department-names")
    public List<String> getAllDepartmentNames() {
        return departmentRepository.findAll().stream()
                .map(Department_table::getDepartment_name)
                .collect(Collectors.toList());
    }

    // POST 요청: 자산 폐기 신청
    @PostMapping("/assets/dispose")
    public void disposeAssets(@RequestBody List<String> assetNumbers) {
        List<Asset_table> assetsToDispose = assetRepository.findAllById(assetNumbers);
        for (Asset_table asset : assetsToDispose) {
            asset.setStatus(Status.폐기); // "폐기" 문자열 대신 Status.폐기 열거형 상수 사용
        }
        assetRepository.saveAll(assetsToDispose);
    }
}